import React from 'react'
import path from 'path'

export default {
  plugins: [
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
  getRoutes: () => [
      {
        path: '/',
        template: 'src/containers/calculator',
      },
  ],
  //siteRoot: 'http://localhost:3000',
  basePath: 'health-insurance',
  devBasePath: 'health-insurance',
  Document: ({
    Html,
    Head,
    Body,
    children,
    state: { siteData, renderMeta },
  }) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Health Insurance Calculator</title>
      </Head>
      <Body>{children}</Body>
    </Html>
  ),
}
