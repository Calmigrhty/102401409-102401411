function validatePostInput(title, contact) {
  const normalizedTitle = String(title || "").trim();
  const normalizedContact = String(contact || "").trim();

  if (!normalizedTitle) {
    return {
      valid: false,
      message: "请填写物品名称"
    };
  }

  if (!normalizedContact) {
    return {
      valid: false,
      message: "请填写联系方式"
    };
  }

  return {
    valid: true,
    message: ""
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validatePostInput
  };
}