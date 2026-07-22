import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUsers, createUser } from './userApi'

const sampleUsers = [
  { id: 1, name: 'Alice', age: 30, city: 'CityA', state: 'ST', pincode: '11111' }
]

describe('userApi', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getUsers returns data when fetch is ok', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(sampleUsers) })) as any

    const result = await getUsers()
    expect(result).toEqual(sampleUsers)
  })

  it('createUser calls fetch with Authorization header', async () => {
    const createdUser = { id: 2, name: 'Bob', age: 25, city: 'CityB', state: 'ST', pincode: '22222' }
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(createdUser) })) as any

    const user = { name: 'Bob', age: 25, city: 'CityB', state: 'ST', pincode: '22222' }
    const token = 'token123'

    const result = await createUser(user, token)
    expect(result).toEqual(createdUser)
    expect(global.fetch).toHaveBeenCalled()
    const [[, options]] = (global.fetch as any).mock.calls
    expect(options.headers.Authorization).toBe(`Bearer ${token}`)
  })
})
