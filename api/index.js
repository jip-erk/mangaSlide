import { client, q } from './db'

export const includedTags = async (data) => {
  try {
    const includedTags = await client.query(
      q.Update(q.Ref(q.Collection('manga-app'), '344368514501443789'), {
        data: { included_tags: data },
      })
    )
    return includedTags
  } catch (err) {
    console.log(err)
  }
}

export const excludedTags = async (data) => {
  try {
    const excludedTags = await client.query(
      q.Update(q.Ref(q.Collection('manga-app'), '344368514501443789'), {
        data: { excluded_tags: data },
      })
    )
    return excludedTags
  } catch (err) {
    console.log(err)
  }
}

export const updateManga = async (Slug, Status, Id) => {
  try {
    // in data to mangas array add slug and status of manga
    const updateManga = await client.query(
      q.Update(q.Ref(q.Collection('manga-app'), '344368514501443789'), {
        data: {
          mangas: [
            {
              slug: Slug,
              id: Id,
              status: Status,
            },
          ],
        },
      })
    )

    return updateManga
  } catch (err) {
    console.log(err)
  }
}

export const getdbTags = async () => {
  try {
    const getdbTags = await client.query(
      q.Get(q.Ref(q.Collection('manga-app'), '344368514501443789'))
    )
    return getdbTags
  } catch (err) {
    console.log(err)
  }
}

export const setCurrentPage = async (data) => {
  try {
    const setCurrentPage = await client.query(
      q.Update(q.Ref(q.Collection('manga-app'), '344717698660303054'), {
        data: { currentPage: data },
      })
    )
    return setCurrentPage
  } catch (err) {
    console.log(err)
  }
}

// get current page from document 344717698660303054 in collection manga-app
export const getCurrentPage = async () => {
  try {
    const getCurrentPage = await client.query(
      q.Get(q.Ref(q.Collection('manga-app'), '344717698660303054'))
    )
    return getCurrentPage
  } catch (err) {
    console.log(err)
  }
}

// if in collection mangas data.slug already exists, update it else create a new document
export const createManga = async (data) => {
  try {
    const updateOrCreateManga = await client.query(
      q.If(
        q.Exists(q.Match(q.Index('mangas_by_slug'), data.slug)),
        q.Update(
          q.Select('ref', q.Get(q.Match(q.Index('mangas_by_slug'), data.slug))),
          { data }
        ),
        q.Create(q.Collection('mangas'), { data })
      )
    )
    return updateOrCreateManga
  } catch (err) {
    console.log(err)
  }
}

// update document in with slug same as data.slug in collection mangas
export const updateCurrentChapter = async (data) => {
  try {
    const updateCurrentChapter = await client.query(
      q.Update(
        q.Select('ref', q.Get(q.Match(q.Index('mangas_by_slug'), data.slug))),
        { data: { currentChapter: data.currentChapter } }
      )
    )
    return updateCurrentChapter
  } catch (err) {
    console.log(err)
  }
}
