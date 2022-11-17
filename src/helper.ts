import axios from 'axios'
interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType ='size' | 'format' | null
export function beforeUploadCheck (file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}
export async function getImageUrl (ImageId: string): Promise<string> {
  const { data } = await axios.get(`image/${ImageId}`)
  return data.data.url
}

export const arrToObj = <T extends {_id?:string}>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as {[key:string]: T})
}

export const objToArr = <T>(obj:{[key:string]:T}) => {
  return Object.keys(obj).map(key => obj[key])
}

export function imageError () {

}
