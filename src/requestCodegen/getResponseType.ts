import { refClassName, toBaseType } from "../utils";
import { IRequestMethod } from "../swaggerInterfaces";
/**
 * 获取请求的返回类型
 */
export function getResponseType(reqProps: IRequestMethod): { responseType: string, isRef: boolean } {
  // It does not allow the schema defined directly, but only the primitive type is allowed. 
  let result: string = 'any';
  let isRef = false
  // 提取Schema
  const resSchema = reqProps.responses['200'] && reqProps.responses['200'].schema
    ? reqProps.responses['200'].schema
    : null

  if (resSchema) {
    let checkType = resSchema.type
    // 如果是数组
    if (checkType === 'array' || resSchema.items) {

      if (resSchema.items.$ref) {
        const refType = refClassName(resSchema.items.$ref)
        isRef = true
        result = refType + '[]'
      } else {
        const refType = toBaseType(resSchema.type)
        result = refType + '[]'
      }

    } else if (resSchema.$ref) {
      // 如果是引用对象
      result = refClassName(resSchema.$ref) || 'any'
      isRef = true

    } else {
      result = checkType
      result = toBaseType(result)
    }

    if (result == 'object') {
      result = 'any';
    } else if (result == 'array') {
      result = 'any[]';
    }
  }

  return { responseType: result, isRef }
}