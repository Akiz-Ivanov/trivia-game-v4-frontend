const safeJSONMigration = <T>(key: string, defaultValue: T, validator?: (v: unknown) => boolean) => {
  const raw = localStorage.getItem(key)
  try {
    const parsed = JSON.parse(raw ?? "")
    if (validator ? !validator(parsed) : typeof parsed !== typeof defaultValue) {
      localStorage.setItem(key, JSON.stringify(defaultValue))
    }
  } catch {
    localStorage.setItem(key, JSON.stringify(defaultValue))
  }
}

export const migrateLocalStorage = () => {

  const migrations = {
    "radio-favorites": () => safeJSONMigration("radio-favorites", [], Array.isArray),
    "triviaFormData": () => safeJSONMigration("triviaFormData", { amount: "10", category: "Any", difficulty: "Any" }, v => typeof v === "object" && v !== null && !Array.isArray(v)),
    "settings": () => safeJSONMigration("settings", { animations: true, illustrations: true, backgroundGlow: true, sound: true, backgroundPattern: true, sparkles: true, timer: true, radioTheme: 'retro', theme: 'halloween' }, v => typeof v === "object" && v !== null && !Array.isArray(v)),
    "isRadioOn": () => safeJSONMigration("isRadioOn", true, v => typeof v === "boolean"),
    "loggedUser": () => safeJSONMigration("loggedUser", null),
    "radio-volume": () => safeJSONMigration("radio-volume", 0.5, v => typeof v === "number")
  }

  // Run all migrations
  Object.values(migrations).forEach(fn => fn())
}