export const desensitizationPrincipalId = (
  principalId: string,
  firstLength: number = 5,
  lastLength: number = 3
) => {
  if (principalId) {
    const firstPart = principalId.slice(0, firstLength);
    const secondPart = principalId.slice(
      principalId.length - lastLength,
      principalId.length
    );

    return `${firstPart}...${secondPart}`;
  }
};
