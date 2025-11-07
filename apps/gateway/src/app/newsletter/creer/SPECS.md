# In `apps/gateway/src/app/newsletter/creer/index.tsx`, create a form to create newsletter items that will be fetched when accessing `apps/gateway/src/app/newsletter/[[...slug]]`
  - Use previous forms as a starting reference
    - [x] `apps/gateway/src/app/decouverte-des-metiers/page.tsx`
    - [x] `apps/gateway/src/app/sondage/erasmus/page.tsx`
  - Use the same code patterns already in use in existing referenced forms
    - [x] zod schema validation and input field errors
    - [x] aws-amplify/data, @amplify/data/resource, observeQuery
    - [x] dompurify
    - [x] @src/lib/admin-auth pattern as used in `apps/gateway/src/app/decouverte-des-metiers/page.tsx`
    - [x] Use design system elements such as `<Section/>`, `<Title/>`, `<Input/>` with `flexStyles.isGridDisplayGrid` div holders
  - Implement the usage of the following new code patterns
    - [x] Where possible plan to use [MDX](https://mdxjs.com/docs/) patterns. Follow [How to use MDX](https://nextjs.org/docs/app/guides/mdx) guide.
      - [x] Create [mdx-components.tsx](https://nextjs.org/docs/app/guides/mdx#add-an-mdx-componentstsx-file)
      - [x] Implement at a later stage
      - [ ] Implement now

  ## The Newsletter form should have the following structure:
  - [x] A newsletter event datetime field GMT+2 `YYYY-MM-DD`(Date de l'événement) which will be used to create part of the dynamic route `$baseURL/newsletter/year/month/day/...`. Final datetime is saved as `YYYY-MM-DDT00:00:00+02:00`. Required
  - [x] A subject string field (Sujet). Required. Must be unique. Concatenate at end with number in parentheses if same subject already present.
  - [x] The subject string (slug) converted to kebab-case. Read Only. Must be unique. Increment with number at end if same subject already present. Needed to compose the end part of the dynamic route : `$baseURL/newsletter/year/month/day/$subject`.
  - [x] A publication datetime field GMT+2 `YYYY-MM-DD` (Date de publication) to indicate when the newsletter event should be made visible online publicly to all users. Final datetime is saved as `YYYY-MM-DDT00:00:00+02:00`. A publication date cannot be after event date. An admin user can view newsletter event at any time regardless of publication date. Required
  - [x] A title string field (Titre). Optional
  - [x] A greetings string field (Salutations). Optional
  - [x] An array of any number of contentBlocks, at least one must be defined, that can be composed of any number of contentItems.

  ## The model for the Newsletter form should include
  - [x] A `@hasMany` relationship to to ContentBlocks model `[contentBlocks!]!`
  - [x] A field that contains the sanitized browser HTML or better yet MDX of the composed newsletter
    - [x] Use sanitized HTML for the moment
    - [x] Plan to use MDX [Remote MDX in NextJs](https://nextjs.org/docs/app/guides/mdx#remote-mdx), [Remote MDX in App Router](https://github.com/ipikuka/next-mdx-remote-client?tab=readme-ov-file#the-part-associated-with-nextjs-app-router)
    - [ ] Use MDX
  - [x] A field that will contain an array of sanitized HTML strings or strings that will constitute parts of the multipart/alternative email for the composed newsletter. [see messageParts](/home/ischerer/workspaces/flex/websocket-app/ape-la-source/apps/la-source/ape/on-board/server/src/functions/googleapi-send-emails-in-series.mts)
    - [x] Plan methodology to generate this data
    - [x] Implement at a later stage
    - [ ] Implement now
  - Newsletter Model :
    ```typescript
      Newsletter: a.model({
        eventDate: a.datetime().required(),
        subject: a.string().required(),
        slug: a.string().required(), // auto-generated from subject
        publicationDate: a.datetime().required(),
        title: a.string(),
        greetings: a.string(),
        htmlContent: a.string(), // generated content
        emailParts: a.string().array(), // for email sending
        isDeleted: a.boolean().default(false),
        createdAt: a.datetime(),
        updatedAt: a.datetime()
      })
    ```

  ## The model for ContentBlocks should include
  - [x] A `@belongsTo` relationship to Newsletter model
  - [x] A list of possible option types (ENUM) that define the current ContentBlock :
    ```typescript
      EContentBlockType: a.enum([
        'LEFT_ALIGNED_TEXT',
        'LEFT_ALIGNED_URL',
        'CENTRED_TEXT',
        'CENTERED_URL',
        'CENTRED_IMAGE',
      ])
    ```
  - [x] A subtitle field. string. Optional
  - [x] A href field. string. If `LEFT_ALIGNED_URL` or `CENTERED_URL` (Required) else (Optional)
  - [x] A content field. string | Buffer | Stream. If `LEFT_ALIGNED_TEXT` or `LEFT_ALIGNED_URL` or`CENTRED_TEXT` or `CENTERED_URL` or `CENTRED_IMAGE` (Required) else (Optional)
  - [x] A paragraph field. string[]. (Optional)
  - [x] A filename field. string. If `CENTRED_IMAGE` (Required) else (Optional)
  - [x] A filetype field. string. If `CENTRED_IMAGE` (Required) else (Optional)
  - [x] A encoding field. string. If `CENTRED_IMAGE` (Required) else (Optional)
  - [x] A path field. string | Data URI. Optional
  - [x] A contentType field. string. Optional
  - [x] A raw field. Pre‑built MIME node. string[]. Optional
  - ContentBlock Model :
    ```typescript
      ContentBlock: a.model({
        newsletterId: a.id().required(),
        newsletter: a.belongsTo('Newsletter', 'newsletterId'),
        order: a.integer().required(),
        type: a.ref('EContentBlockType').required(),
        subtitle: a.string(),
        href: a.string(),
        content: a.string(),
        paragraph: a.string().array(),
        filename: a.string(),
        filetype: a.string(),
        encoding: a.string(),
        path: a.string(),
        contentType: a.string()
        raw: a.string().array()
      })
    ```

  ## The form should have several display modes
  1. A list of all the subject newsletter events with publication dates `YYYY-MM-DD` currently not deleted, always visible.
    - [x] Alongside each subject / publication newsletter item is a checkbox to reuse the content in the form to compose a new newsletter, visible to connected admin users.
    - [x] Alongside each subject / publication newsletter item is a link `Voir en ligne` that opens a new tab in the browser to view the newsletter url, always visible. If the user is not authenticated as admin and the current date is before publication date then an alert dialog should warn `L'événement n'est pas encore publié`
    - [x] Alongside each subject / publication newsletter item is a delete icon that marks the item as deleted. The onClick should propose an alert `Etes vous sûr de vouloir supprimer cette newsletter` that must be acknowledged by the user before deleting the item, visible to connected admin users.
    - [x] The list should be structured as a responsive table where publication date, checkboxes and links slide under subject on mobile screen. Use `<Table/>` design system component as used in `apps/gateway/src/components/footer/privacy_policy.tsx`
    - [x] Under the list of all the subject newsletter events is a button `Administration 🔒` that toggles admin state as implemented in `apps/gateway/src/app/decouverte-des-metiers/page.tsx`
    - [x] When user is authenticated as a admin user another button `Créer un nouveau newsletter` is present that displays the form to compose a new newsletter underneath. The button can be also be toggled to hide the form to compose a new newsletter `Cacher le formulaire`.
  2. The form to compose a new newsletter available to connected admin users.
    - [x] The order of inputs fields is subject (Sujet), event date (Date de l'événement), publication (Date de publication), title (Titre), greetings (Salutations), contentBlocks array zone, sign-off (Signature).
    - [x] The contentBlocks array zone is a touchevent area where individual contentBlocks can be reordered.
      - [x] Each contentBlock is a design system `<Box/>` component.
      - [x] Each contentBlock has a hamburger `\u2630` icon on top right corner to reposition it.
      - [x] Each contentBlock has a hamburger `\u2716` icon on top left corner to delete it.
    - [x] At the bottom of contentBlocks array zone is a button to add a new contentBlock to zone `Ajouter un élément`
    - [x] Each contentBlock is it's own form whereby the user can choose the type of contentBlock.
      - [x] When selecting the type of contentBlock to create, the additional required fields are displayed for that type EContentBlockType.
  3. A view mode to display the current newsletter being composed in browser HTML format. The view mode is a sidebar of the form to compose a new newsletter in Tablet screen resolutions and above (use css grid). The view mode is a design system `<Modal/>` component in mobile screen resolutions that is triggered by a button [👁 U+1F441 EYE](https://unicode-explorer.com/c/1F441) present as sticky element in form to compose a new newsletter.

  ## The form has several helper functions to generate markup for browser HTML that should produce markup that adheres to structure in [Email](/home/ischerer/workspaces/flex/la-source-ape/apps/gateway/src/app/newsletter/[[...slug]]/_content/2025/11/14/cafe-des-parents/index.tsx)
  1. A main newsletterContentGenerator() function that generates the overall HTML structure
    ```javascript
    const newsletterContentGeneratorHTML = (title, greetings, contentBlocks) => {
      return (
        <div className={stylesPage.newsletterContent}>
          <table role="presentation" cellSpacing={0} cellPadding="0" border={0} width="100%">
            <tbody>
              <tr>
                <td>
                  <div className={stylesPage.emailContainer}>
                    <div className={stylesPage.imageContainer}>
                      <Image src={'/assets/img/newsletter/presentation/logo_ape_900x175.png'}
                        alt="Logo de l'APE La Source" width="400" height="200" className={stylesPage.centeredImage} />
                    </div>
                    {title && (
                      <div className={stylesPage.contentBlock}>
                        <h1>{title}</h1>
                      </div>
                    )}
                    {contentBlocks.map((contentBlock, index) => {
                      if (greetings && index === 0) return contentBlockGeneratorHTML(greetings, contentBlock)
                      return contentBlockGeneratorHTML(greetings = null, contentBlock)
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
    ```
  2. A contentBlockGenerator() function
    ```javascript
    const contentBlockGeneratorImageHTML = (filetype, encoding, content) => {
      return (
        <div className={stylesPage.imageContainer}>
          <Image src={`data:image/${filetype};${encoding}, ${content}`}
            alt="Image newsletter" width="400" height="200" className={stylesPage.centeredImage} />
        </div>
      )
    }
    const contentBlockGeneratorPdfHTML = (filetype, encoding, content) => {
      return (
        <div className={stylesPage.contentBlock}>
          <p><strong>
            <span className={stylesPage.linkHolder}>
              <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                href={href} target="_blank">{content !== null content : href}
              </FlexLink>
            </span>
          </strong></p>
        </div>
      )
    }
    const contentBlockGeneratorCenteredUrlHTML = (href, content) => {
      return (
        <div className={stylesPage.contentBlock}>
          {greetings && (
            <h2>{greetings}</h2>
          )}
          {subtitle && !greetings && (
            <h3>{subtitle}</h3>
          )}
          <table role="presentation" cellSpacing={0} cellPadding="0" border={0} width="100%" className={stylesPage.outlookFix}>
            <tbody>
              <tr>
                <td align="center">
                  <p><strong>
                    <span className={stylesPage.linkHolder}>
                      <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                        href={href} target="_blank">{content !== null content : href}
                      </FlexLink>
                    </span>
                  </strong></p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
    const contentBlockGeneratorCenteredTextHTML = (content) => {
      return (
        <div className={stylesPage.contentBlock}>
          {greetings && (
            <h2>{greetings}</h2>
          )}
          {subtitle && !greetings && (
            <h3>{subtitle}</h3>
          )}
          <table role="presentation" cellSpacing={0} cellPadding="0" border={0} width="100%" className={stylesPage.outlookFix}>
            <tbody>
              <tr>
                <td align="center">
                  <div className={classNames(flexStyles.hasTextCentered)}>{content}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
    const contentBlockGeneratorLeftAlignedTextHTML = (content) => {
      return (
        <div className={stylesPage.contentBlock}>
          {greetings && (
            <h2>{greetings}</h2>
          )}
          {subtitle && !greetings && (
            <h3>{subtitle}</h3>
          )}
          {content}
        </div>
      )
    }
    const contentBlockGeneratorLeftAlignedUrlHTML = (href, content) => {
      return (
        <div className={stylesPage.contentBlock}>
          {greetings && (
            <h2>{greetings}</h2>
          )}
          {subtitle && !greetings && (
            <h3>{subtitle}</h3>
          )}
          <p><strong>
            <span className={stylesPage.linkHolder}>
              <FlexLink className={classNames(flexStyles.link, flexStyles.hasInheritedColor)}
                href={href} target="_blank">{content !== null content : href}
              </FlexLink>
            </span>
          </strong></p>
        </div>
      )
    }
    const contentBlockGeneratorHTML = (type, greetings, subtitle, content, filename, filetype, encoding, filename, href, ...others) => {
      return (
        <>
          {type === 'CENTRED_IMAGE' && contentBlockGeneratorImageHTML(filetype, encoding, content)}
          {type === 'CENTERED_URL' && contentBlockGeneratorCenteredUrlHTML(href, content, greetings, subtitle)}
          {type === 'CENTRED_TEXT' && contentBlockGeneratorCenteredTextHTML(content, greetings, subtitle)}
          {type === 'LEFT_ALIGNED_URL' && contentBlockGeneratorLeftAlignedUrlHTML(href, content, greetings, subtitle)}
          {type === 'LEFT_ALIGNED_TEXT' && contentBlockGeneratorLeftAlignedTextHTML(content, greetings, subtitle)}
        </>
      )
    }
    ```

  ## The form has several helper functions to generate email markup [see <!DOCTYPE html> and subsequent relatedBoundaries](/home/ischerer/workspaces/flex/websocket-app/ape-la-source/apps/la-source/ape/on-board/server/src/functions/googleapi-send-emails-in-series.mts) that will be assigned to `ContentBlock.raw` and then compiled to `Newsletter.emailParts`
  - [x] Plan helper functions to use
  - [x] Implement at a later stage
  - [ ] Implement now

  ## File Upload Strategy
    - [x] For `CENTRED_IMAGE` accept images with extensions png or jpeg or jpg only. Convert to base64 encoding and save to `ContentItem.content`. Use [Image upload in Next.js with Base64 encoding](https://kirandev.com/image-upload-in-nextjs-with-base64-encoding) as a starting point for Uploader. `ContentItem.filename`, `ContentItem.filetype` and `ContentItem.encoding` fields must also be provided.

  ## Currently `apps/gateway/src/app/newsletter/[[...slug]]/page.tsx` displays index files in _content folder if present. Additional logic needs to be added to retrieve newsletter content that exists in database in addition to static content already in _content folder.
