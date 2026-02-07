const AVATAR_COLORS = [
  'bg-sky-500',
  'bg-emerald-500',
  'bg-pink-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-indigo-500'
];

export const AVATARS = Array.from({ length: 50 }, (_, index) => ({
  id: `avatar-${index + 1}`,
  name: `Avatar ${index + 1}`,
  bgColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  initials: true
}));

export function normalizeAvatarId(id?: string) {
  if (!id) return '';
  if (/^avatar-\d+$/.test(id)) return id;
  const legacyMatch = id.match(/^avatar(\d+)$/);
  if (legacyMatch) return `avatar-${legacyMatch[1]}`;
  return id;
}

const avatarImageEntries = import.meta.glob<{ default: string }>(
  '/src/assets/avatars/*.{svg,png,jpg,jpeg}',
  {
    eager: true,
    import: 'default'
  }
);

const avatarImageMap: Record<string, string> = {};
Object.entries(avatarImageEntries).forEach(([path, src]) => {
  const filename = path.split('/').pop();
  if (!filename) return;
  const name = filename.replace(/\.[^.]+$/, '');
  avatarImageMap[name] = src as string;
});

const allAvatarImages = Object.entries(avatarImageMap)
  .map(([name, src]) => ({ name, src }))
  .sort((a, b) => {
    const aNum = Number.parseInt(a.name.replace(/\D/g, ''), 10);
    const bNum = Number.parseInt(b.name.replace(/\D/g, ''), 10);
    if (Number.isNaN(aNum) || Number.isNaN(bNum)) return a.name.localeCompare(b.name);
    return aNum - bNum;
  });

const dashedAvatars = allAvatarImages.filter((avatar) => avatar.name.startsWith('avatar-'));
const fallbackAvatars = allAvatarImages.filter((avatar) => !avatar.name.startsWith('avatar-'));

export function getAvatarImages() {
  return dashedAvatars.length > 0 ? dashedAvatars : fallbackAvatars;
}

export function getAvatarImageSrc(id?: string) {
  if (!id) return null;
  const normalized = normalizeAvatarId(id);
  return avatarImageMap[normalized] || avatarImageMap[id] || null;
}

export function getAvatarByID(id?: string) {
  const normalized = normalizeAvatarId(id);
  return AVATARS.find((a) => a.id === normalized) || AVATARS[0];
}

export function getAvatarColor(id?: string) {
  const avatar = getAvatarByID(id);
  return avatar.bgColor;
}
