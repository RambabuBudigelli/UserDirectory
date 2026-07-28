import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getUsers, createUser } from './userApi'
import type { CreateUserRequest, User } from '../types/User'

describe('userApi', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getUsers returns data when fetch is ok', async () => {
    const sampleUsers: User[] = [
      { id: 1, name: 'Alice', age: 30, city: 'CityA', state: 'ST', pincode: '11111' }
    ]

    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => sampleUsers
      })
    )

    globalThis.fetch = fetchMock as unknown as typeof fetch

    const result = await getUsers()

    expect(result).toEqual(sampleUsers)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('createUser calls fetch with Authorization header', async () => {
    const createdUser: User = {
      id: 2,
      name: 'Bob',
      age: 25,
      city: 'CityB',
      state: 'ST',
      pincode: '22222'
    }

    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => createdUser
      })
    )

    globalThis.fetch = fetchMock as unknown as typeof fetch

    const user: CreateUserRequest = {
      name: 'Bob',
      age: 25,
      city: 'CityB',
      state: 'ST',
      pincode: '22222'
    }

    const token = 'token123'

    const result = await createUser(user, token)

    expect(result).toEqual(createdUser)
    expect(fetchMock).toHaveBeenCalledOnce()

    const calls = fetchMock.mock.calls as unknown as Array<[RequestInfo, RequestInit?]>
    const options = calls[0]?.[1]

    expect(options).toBeDefined()

    const headers = options?.headers
    let authorizationHeader: string | null | undefined

    if (headers instanceof Headers) {
      authorizationHeader = headers.get('Authorization')
    } else if (headers && typeof headers === 'object') {
      authorizationHeader = (headers as Record<string, string>)["Authorization"]
    }

    expect(authorizationHeader).toBe('Bearer ' + token)
  })
})
