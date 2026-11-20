import {
  getFindDuplicatesResponse200,
  getFindManyResponse200,
} from 'src/engine/core-modules/open-api/utils/responses.utils';

describe('getFindDuplicatesResponse200', () => {
  it('documents nullable opaque cursors and both page flags', () => {
    const response = getFindDuplicatesResponse200({ nameSingular: 'company' });
    const pageInfo =
      response.content['application/json'].schema.properties.data.items
        .properties.pageInfo;
    expect(pageInfo.properties).toEqual({
      hasNextPage: { type: 'boolean' },
      hasPreviousPage: { type: 'boolean' },
      startCursor: { type: ['string', 'null'] },
      endCursor: { type: ['string', 'null'] },
    });
  });
});

describe('getFindManyResponse200', () => {
  it('documents the direct metadata list envelope and complete page info', () => {
    const response = getFindManyResponse200({
      item: { nameSingular: 'view', namePlural: 'views' },
      isDirectDataFeatureFlagged: true,
    });
    expect(response).toMatchObject({
      content: {
        'application/json': {
          schema: {
            properties: {
              data: {
                oneOf: [
                  {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ViewForResponse' },
                  },
                  {
                    type: 'object',
                    properties: {
                      views: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/ViewForResponse',
                        },
                      },
                    },
                  },
                ],
              },
              pageInfo: {
                properties: {
                  hasNextPage: { type: 'boolean' },
                  hasPreviousPage: { type: 'boolean' },
                  startCursor: { type: ['string', 'null'] },
                  endCursor: { type: ['string', 'null'] },
                },
              },
            },
          },
        },
      },
    });
  });

  it('keeps the workspace record REST envelope nested', () => {
    const response = getFindManyResponse200({
      item: { nameSingular: 'company', namePlural: 'companies' },
    });

    expect(response).toMatchObject({
      content: {
        'application/json': {
          schema: {
            properties: {
              data: {
                type: 'object',
                properties: {
                  companies: { type: 'array' },
                },
              },
            },
          },
        },
      },
    });
  });
});
