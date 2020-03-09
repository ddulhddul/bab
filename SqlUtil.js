import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('bab.db')

const SqlUtil = {
  async initCustomTable () {
    await this.initBabTable()
  },

  async listBab (param = {}) {
    const { res } = await this.queryExecute(
      `SELECT * FROM TB_BAB`,
      []
    )
    return (res.rows||{})._array || []
  },

  async modifyBab (param = {}) {
    if (param.bab_id) return await this.updateBab(param)
    else return await this.insertBab(param)
  },

  async deleteBab (param = {}) {
    const { res } = await this.queryExecute(
      `delete from TB_BAB
      WHERE bab_id = ?`,
      [
        param.bab_id
      ]
    )
    return res
  },
  
  async updateBab (param = {}) {
    const { res } = await this.queryExecute(
      `update TB_BAB
      set 
        user_id = ?,  
        yyyy = ?,
        mm = ?,
        dd = ?,
        cost = ?
      WHERE bab_id = ?`,
      [
        param.user_id,
        Number(param.yyyy),
        Number(param.mm),
        Number(param.dd),
        param.cost,
        param.bab_id
      ]
    )
    return res
  },
  
  async insertBab (param = {}) {
    const { res } = await this.queryExecute(
      `insert into TB_BAB (
        user_id,
        yyyy,
        mm,
        dd,
        cost
      ) values (
        ?, ?, ?, ?, ?
      )`,
      [
        param.user_id,
        Number(param.yyyy),
        Number(param.mm),
        Number(param.dd),
        param.cost
      ]
    )
    return res || {}
  },

  async initBabTable () {
    // await this.queryExecute(`DROP TABLE IF EXISTS TB_BAB`)

    const { res } = await this.queryExecute(`
    SELECT 1 FROM sqlite_master 
    WHERE type='table' 
    AND name='TB_BAB'
    AND EXISTS (
        SELECT 1 
        FROM sqlite_master 
        WHERE name = 'TB_BAB' 
        AND sql LIKE '%name%'
    )
    `, [])
    if (res.rows.length == 0) {
        const { tx1, res1 } = await this.queryExecute(
          `CREATE TABLE IF NOT EXISTS TB_BAB (
            bab_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            user_id INTEGER,
            yyyy NUMBER(4),
            mm NUMBER(2),
            dd NUMBER(2),
            cost INTEGER DEFAULT 0,
            create_datetime datetime default current_timestamp 
          )`,
          []
        )
    }
  },

  async queryExecute (sql = '', param = [], callback = () => { }) {
    return new Promise((resolve, reject) => db.transaction(tx => {
      tx.executeSql(sql, param,
        (tx, res) => {
          callback(tx, res)
          return resolve({ tx, res })
        },
        (...params) => {
          console.log('db error', ...params)
          alert(`관리자에게 문의하세요\n이메일: ddulhddul@gmail.com`)
          reject(...params)
        }
      )
    }))
  }

}
export default SqlUtil