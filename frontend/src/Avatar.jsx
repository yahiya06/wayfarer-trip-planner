export const avatarStyles = ['sage', 'sand', 'rose', 'sky', 'lavender']

function initialsFrom(name) {
  return (name || 'Traveler')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function Avatar({ name, email, size = 'large', variant }) {
  const colorSeed = [...(email || name || 'traveler')].reduce((total, character) => total + character.charCodeAt(0), 0)
  const palette = avatarStyles.includes(variant) ? variant : avatarStyles[colorSeed % avatarStyles.length]

  return <span className={`user-avatar user-avatar-${size} avatar-${palette}`} aria-hidden="true"><span>{initialsFrom(name)}</span><i>✦</i></span>
}

export default Avatar
