const validateNewPasswords = (
  newPassword: string,
  repeatPassword: string
): boolean => {
  return newPassword === repeatPassword
}

export default validateNewPasswords
