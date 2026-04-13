import type { IApplicant } from '@/modules/applicants'

interface ICreateApplicantDto {
  fullName: string
  phone?: string
  status?: 'new' | 'in_work' | 'done'
}

interface IUpdateApplicantDto {
  fullName?: string
  phone?: string
  status?: 'new' | 'in_work' | 'done'
}

class InMemoryDb {
  private store: Map<number, IApplicant> = new Map()
  private idCounter: number = 1

  getAll(): IApplicant[] {
    return Array.from(this.store.values())
  }

  getById(id: number): IApplicant | null {
    return this.store.get(id) || null
  }

  create(data: ICreateApplicantDto): IApplicant {
    const id = this.idCounter++
    const record: IApplicant = {
      ...data,
      id,
      phone: data.phone || '',
      status: data.status || 'new',
      createdAt: new Date().toISOString(),
    }

    this.store.set(id, record)

    return { ...record }
  }

  update(id: number, data: IUpdateApplicantDto): IApplicant | null {
    const existing = this.store.get(id)

    if (!existing) return null

    const updated: IApplicant = { ...existing, ...data }

    this.store.set(id, updated)

    return { ...updated }
  }

  remove(id: number): IApplicant | null {
    const record = this.store.get(id) || null

    this.store.delete(id)

    return record
  }

  seed(items: Omit<IApplicant, 'id' | 'createdAt'>[]): void {
    this.store.clear()

    this.idCounter = 1

    items.forEach((item) => this.create(item))
  }

  reset(): void {
    this.store.clear()
    this.idCounter = 1
  }
}

export const ApplicantsDB = new InMemoryDb()
