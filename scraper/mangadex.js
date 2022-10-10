import fetch from 'node-fetch-extra'
import { getdbTags } from '../api/index'
import { getDataFromURL } from './index.js'

export async function getTags() {
  const url = 'https://api.mangadex.org/manga/tag'
  const data = await getDataFromURL(url)
  return data.data
}

export async function searchMangadex(page) {
  let pageUrl = ''

  const tags = await getdbTags()

  const includedTags =
    tags.data.included_tags.length !== 0
      ? '&includedTags[]=' +
        Object.keys(tags.data.included_tags)
          .map((key) => tags.data.included_tags[key].id)
          .join('&includedTags[]=')
      : ''

  const excludedTags =
    tags.data.excluded_tags.length !== 0
      ? '&excludedTags[]=' +
        Object.keys(tags.data.excluded_tags)
          .map((key) => tags.data.excluded_tags[key].id)
          .join('&excludedTags[]=')
      : ''

  pageUrl = `https://api.mangadex.org/manga?order[rating]=desc&limit=1&offset=${page}${
    (includedTags, excludedTags)
  }&contentRating[]=suggestive`
  // mangadex excludetags

  const pageReq = await fetch('/api/' + pageUrl)
  const data = await pageReq.json()

  return data.data[0].id
}

export async function scrapeMangadex(slug, chapterId) {
  try {
    const originalData = await getDataFromURL(
      `https://api.mangadex.org/manga/${slug}?includes[]=cover_art`
    )
    const data = originalData.data

    // Get titleposterUrl
    const title =
      data.attributes.title.en || Object.values(data.attributes.title)[0]

    let posterUrl = 'https://i.imgur.com/6TrIues.jpg'

    // Find cover (poster)
    const posterData = originalData.data.relationships.find(
      (relation) => relation.type === 'cover_art'
    )
    if (posterData) {
      if (posterData.attributes) {
        posterUrl = `/proxy-image?url=https://uploads.mangadex.org/covers/${slug}/${posterData.attributes.fileName}.512.jpg`
      } else if (posterData.id) {
        posterUrl = `/mangadex-cover/${slug}/${posterData.id}`
      }
    }

    // Get genres from tags
    const genres = data.attributes.tags.map((tag) => tag.attributes.name.en)

    // Get alternate titles
    const alternateTitles = data.attributes.altTitles.map((t) => t.en)

    // Get status
    const status = data.attributes.status.toLowerCase()

    // Get chapters
    let offset = 0
    let total = Infinity
    let allChapters = []

    while (offset < total) {
      // Cycle through pagination
      const chapterData = await getDataFromURL(
        `https://api.mangadex.org/manga/${slug}/feed?offset=${offset}&limit=500&translatedLanguage[]=en`
      )
      const mdChapters = (chapterData.data ? chapterData.data : []).filter(
        Boolean
      )

      total = chapterData.total
      offset = chapterData.offset + chapterData.limit

      allChapters = [...allChapters, ...mdChapters]
    }

    // Map fetched chapters into Adolla format

    let largestVolume = 0
    for (const chapter of allChapters) {
      if (Number(chapter.attributes.volume) > largestVolume)
        largestVolume = Number(chapter.attributes.volume)
    }
    /*
                const allReadMdChapters = Object.keys(
                    db.get(`reading_new.mangadex5.${slug}`) || {}
                );

                const chaptersWithDupes = allChapters
                    .map(
                        (ch, i) => {
                            const { attributes: a } = ch;
                            const label =
                                a.volume || a.chapter ?
                                `${a.volume ? `Vol ${a.volume}, ` : ""}chapter ${
        										a.chapter ?? "unknown"
        								  }`
        								: a.title;

        						return {
        							label: label.slice(0, 1).toUpperCase() + label.slice(1),
        							chapter: a.chapter,
        							season: a.volume || 0,
        							date: a.publishAt,
        							hrefString: ch.id,
        							combined: isNaN(Number(a.chapter))
        								? i
        								: Number(a.volume || largestVolume) * 1000 +
        								  Number(a.chapter || ""),
        						};
        					}
        				)
        				.sort(
        					(a, b) =>
        						allReadMdChapters.indexOf(b.hrefString) -
        						allReadMdChapters.indexOf(a.hrefString)
        				);

        const chapterCombineds = [];
        const chapters = chaptersWithDupes
            .filter((chapter) => {
                if (!chapterCombineds.includes(chapter.combined)) {
                    chapterCombineds.push(chapter.combined);
                    return true;
                }
                return false;
            })
            .sort((a, b) => a.combined - b.combined);
        */
    // Find images
    let chapterImages = []

    if (chapterId !== '-1') {
      // Scrape page to find images
      const chapter = allChapters.find((c) => c.id === chapterId)
      if (chapter) {
        const atHome = await getDataFromURL(
          `https://api.mangadex.org/at-home/server/${chapter.id}`
        )
        const { baseUrl } = atHome
        chapterImages = atHome.chapter.data.map(
          (fileName) => `${baseUrl}/data/${atHome.chapter.hash}/${fileName}`
        )
      }
    }

    // Find description

    const descriptionParagraphs = data.attributes.description.en
      ? data.attributes.description.en
          .split('[')[0]
          .replace(/\r/g, '')
          .split('\n')
          .filter(Boolean)
      : []

    // Return it.

    return {
      constant: {
        title,
        slug,
        posterUrl,
        alternateTitles,
        descriptionParagraphs,
        genres,
      },
      data: {
        allChapters,
        chapterImages,
        status,
      },
      success: true,
    }
  } catch (error) {
    console.log(error)
  }
}
