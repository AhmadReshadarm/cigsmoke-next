export const transliterateRussianToEnglish = (text) => {
  const transliterationMap = {
    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'G',
    Д: 'D',
    Е: 'E',
    Ё: 'YO',
    Ж: 'ZH',
    З: 'Z',
    И: 'I',
    Й: 'J',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'H',
    Ц: 'TS',
    Ч: 'CH',
    Ш: 'SH',
    Щ: 'SCH',
    Ъ: '_',
    Ы: 'Y',
    Ь: '_',
    Э: 'E',
    Ю: 'YU',
    Я: 'YA',
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '_',
    ы: 'y',
    ь: '_',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += transliterationMap[char] || char;
  }
  return result;
};

export const isRussian = (str) => {
  return /[а-яА-ЯЁё]/.test(str);
};
