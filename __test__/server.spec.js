const app = require('../src/server/server.js')
const supertest = require('supertest')
const request = supertest(app)
jest.setTimeout(30000)

describe(
    "test suite for server.js",
    () => {
        test("test get all trips",
            async () => {
                const response = await request.get('/trips/all')
                expect(response.status).toBe(200)
            }

        ),
            test("test crud trip",
                async () => {
                    let date0 = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                    let destination0 = 'Chengdu'
                    const response = await request.post('/trips/new').send({
                        'destination': destination0,
                        'date': date0
                    })
                    expect(response.status).toBe(200)
                    let { destination, date, id, weather } =  response.body
                    console.log(destination)
                    expect(destination.name).toBe(destination0)
                    expect(destination.thumbnailUrl).toMatch(/https:\/\/cdn.pixabay.com\/photo.*/)
                    expect(weather).toBeDefined()
                    expect(notes).toBeUndefined()
                    expect(date).toBe(date0)
                    const response1 = await request.get('/trips/all')
                    expect(response1.status).toBe(200)
                    expect(response1.body.length).toBe(1)
                    let notes = 'test'
                    const response2 = await request.post(`/trips/${id}`).send(
                        {
                            'id': id,
                            'notes': notes
                        }
                    )
                    let tripsUpdated = await response2.text
                    expect(tripsUpdated).toContain(notes)
                }
            )
    }
)