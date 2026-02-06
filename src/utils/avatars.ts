export const AVATARS = [
  {
    id: 'avatar-1',
    name: 'Sky',
    bgColor: 'bg-sky-500',
    initials: true
  },
  {
    id: 'avatar-2',
    name: 'Emerald',
    bgColor: 'bg-emerald-500',
    initials: true
  },
  {
    id: 'avatar-3',
    name: 'Pink',
    bgColor: 'bg-pink-500',
    initials: true
  },
  {
    id: 'avatar-4',
    name: 'Red',
    bgColor: 'bg-red-500',
    initials: true
  },
  {
    id: 'avatar-5',
    name: 'Orange',
    bgColor: 'bg-orange-500',
    initials: true
  },
  {
    id: 'avatar-6',
    name: 'Yellow',
    bgColor: 'bg-yellow-500',
    initials: true
  },
  {
    id: 'avatar-7',
    name: 'Green',
    bgColor: 'bg-green-500',
    initials: true
  },
  {
    id: 'avatar-8',
    name: 'Teal',
    bgColor: 'bg-teal-500',
    initials: true
  },
  {
    id: 'avatar-9',
    name: 'Cyan',
    bgColor: 'bg-cyan-500',
    initials: true
  },
  {
    id: 'avatar-10',
    name: 'Aqua',
    bgColor: 'bg-cyan-600',
    initials: true
  },
];

export function getAvatarByID(id?: string) {
  return AVATARS.find(a => a.id === id) || AVATARS[0];
}

export function getAvatarColor(id?: string) {
  const avatar = getAvatarByID(id);
  return avatar.bgColor;
}
