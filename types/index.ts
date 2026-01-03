export interface User {
  id: string
  email: string
  name: string
  role?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkEntry {
  id: string
  userId: string
  title: string
  description: string
  category: "project" | "task" | "contribution"
  proofLinks: {
    repo?: string
    demo?: string
    doc?: string
    image?: string
  }
  date: Date
  status: "pending" | "validated"
  validatorId?: string
  validatorName?: string
  validatedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Validation {
  id: string
  workEntryId: string
  validatorId: string
  validatedAt: Date
}
