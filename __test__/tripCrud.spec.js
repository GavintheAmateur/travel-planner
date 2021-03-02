import {validateDate} from '../src/client/js/tripCrud'

describe(
    "test suite for tripCrud.js",
    ()=> {
        test("test today",
        ()=> {
            let date = new Date().toISOString().split("T")[0]
            expect(validateDate(date)).toBe('')
        }
        ),
        test("test past date",
        ()=> {
            let date = new Date(new Date().getTime()  - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            expect(validateDate(date)).toBe('Please pick today or a future date')
        }
        ),
        test("test date further than 2 weeks",
        ()=> {
            let date = new Date(new Date().getTime()  + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            expect(validateDate(date)).toBe('Please pick a date within 2 weeks')
        }
        ),
        test("test invalid date str",
        ()=> {
            let date = '2000-2'
            expect(validateDate(date)).toBe('Please input a valid date')
        }
        )
    }
)
