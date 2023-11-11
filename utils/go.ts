function upperFirstName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

function replaceProhibitedChars(name: string): string {
    return name.replace(" ", '_')
}
export function NameForGolang(name: string): string {
    return replaceProhibitedChars(upperFirstName(name))
}