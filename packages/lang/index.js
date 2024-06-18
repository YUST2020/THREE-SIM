import zh from './zh.json'
import en from './en.json'
let curLangMap = zh
const langMap = {
    zh, en
}
export const setLang = (langStr = 'zh') => {
    curLangMap = langMap[langStr] || {}
}
export const t = (str = '') => {
    return curLangMap[str] || str
}