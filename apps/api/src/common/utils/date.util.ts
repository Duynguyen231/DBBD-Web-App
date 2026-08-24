// Converts an optional/nullable "YYYY-MM-DD" string (from @IsDateString())
// into a Date for a Prisma `DateTime?` column. undefined stays undefined so
// Prisma leaves the field untouched on partial updates; '' / null clear it.
export function toDateOrNull(value?: string | null): Date | null | undefined {
  if (value === undefined) return undefined
  if (!value) return null
  return new Date(`${value}T00:00:00Z`)
}
