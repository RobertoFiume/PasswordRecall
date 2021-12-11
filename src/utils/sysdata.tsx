/*
    RF: 28.11.2021 SQLIte 
     npm install --save react-native-sqlite-storage --legacy-peer-deps
     npm install --save @types/react-native-sqlite-storage --legacy-peer-deps
     npm install react-native-sqlcipher --save --legacy-peer-deps
*/

import * as React from 'react';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

export interface Card {
  id: string;
  categoryid: string;
  description: string;
  username: string;
  password: string;
  note: string;
  pincode: string;
  url: string;
}

export interface CardSection {
  title: string;
  count: number;
  data: Card[];
}

class SysData {
    private dabaseName: string = "";
    private db: SQLiteDatabase;

    private ENCRYPT_KEY: string = "{B05B6A3B-AA72-44D7-B2DE-35EFC7B9443E}";
    private SQL_CREATE_USERS: string = "CREATE TABLE IF NOT EXISTS USERS" +
                                        "( " +
                                        "  USERID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                                        "  USERNAME VARCHAR(50) NOT NULL COLLATE NOCASE, " +
                                        "  PASSWORD VARCHAR(50) " +
                                        ");";

    private SQL_CREATE_CARDS: string = "CREATE TABLE IF NOT EXISTS CARDS ( " +
                                       "CARDID VARCHAR(40) NOT NULL, " +
                                       "CATEGORYID VARCHAR(40) NOT NULL, " +
                                       "DESCRIPTION VARCHAR(50) COLLATE NOCASE, " +
                                       "URL VARCHAR(100) COLLATE NOCASE, " +
                                       "USERNAME VARCHAR(50) COLLATE NOCASE, " +
                                       "PASSWORD VARCHAR(50), " +
                                       "UNLOCKPASSWORD VARCHAR(50), " +
                                       "PINCODE VARCHAR (6) COLLATE NOCASE, " +
                                       "NOTE TEXT, " +
                                       "PRIMARY KEY (CARDID, CATEGORYID))";

    private SQL_CREATE_CATEGORY: string = "CREATE TABLE IF NOT EXISTS CATEGORIES ( " +
                                          "CATEGORYID varchar(40) NOT NULL, " +
                                          "USERID integer NOT NULL, " +
                                          "DESCRIPTION varchar(50) NOT NULL, " +
                                          "PRIMARY KEY (CATEGORYID, USERID)) " ;

    private SQL_CARDATA: string = "SELECT C.CATEGORYID as categoryid, C.CARDID as cardid, C.DESCRIPTION as cardname, C.URL as url," +
                                  "       C.USERNAME as username, C.PASSWORD as password, C.NOTE as note, C.PINCODE as pincode, " +
                                  "       CT.DESCRIPTION as categoryname " +
                                  " FROM CARDS C " +
                                  "    LEFT OUTER JOIN CATEGORIES CT ON (C.CATEGORYID=CT.CATEGORYID)	" +
                                 " ORDER BY CT.DESCRIPTION,C.DESCRIPTION";

    constructor(databasename: string)
    {
      this.dabaseName = databasename;
      this.db = null;
      console.log("database name: " + this.dabaseName);
    }


    async openDatabse(): boolean {
      let success: Boolean = false;
      this.closeDatabase();

      console.log('Open database ...');
      // wait to open database
      await SQLite.openDatabase({name: this.dabaseName, key: this.ENCRYPT_KEY, createFromLocation: 1}).then((DBConnection) => {
        this.db = DBConnection;
       // console.log('Database info',this.db); 
        this.createTables(this.db);
        success = true;

        console.log('Database opened',success);
      }).catch((error) => {
        success = false;
        console.log("Error on open database",error);

        throw new Error(error); //raise error
      });
       
      return success;
   }

    closeDatabase(): void {
      if (this.db) {
        console.log("Closing database ...");

        this.db.close().then((status) => {
          console.log("Database closed",status);
      }).catch((error) => {
        console.log("Error on close database",error);
      });

      this.db = null;
      } else {
        console.log("Database was not opened");
      }
    }

    private createTables(db: SQLiteDatabase) {
      if (!db)
        return;

      console.log("Create tables if not exists ...");
      
      db.executeSql(this.SQL_CREATE_USERS).catch((error) => {
        console.log("Error on create table",error);
      });

      db.executeSql(this.SQL_CREATE_CARDS).catch((error) => {
        console.log("Error on create table",error);
      });

      db.executeSql(this.SQL_CREATE_CATEGORY).catch((error) => {
        console.log("Error on create table",error);
      });

      console.log("Table created");
    }

    getCards(): CardSection[]  {
      return new Promise<CardSection[]>((resolve, reject) => {
        this.db.executeSql(this.SQL_CARDATA,[])
            .then(([resultset]) => {
                let result: CardSection[] = [];
                let cards: Card[] =[];
                let sectionTitle: string = "";
                let lastsection: string = "";
                       
                for (let i = 0; i < resultset.rows.length; i++) {
                  const sectionFields = {categoryid, categoryname} = resultset.rows.item(i);
                  const cardFields = {categoryid, categoryid, cardname, url, username, password, note, pincode} = resultset.rows.item(i);
                 
                  if (lastsection == "")  
                    lastsection = sectionFields.categoryid;

                  if (lastsection != sectionFields.categoryid) {
                    lastsection = sectionFields.categoryid;
         
                    result.push({title: sectionTitle, count: cards.length, data: cards});
                  
                    sectionTitle = ""; 
                    passwordcard = [];
                  }

                  sectionTitle = sectionFields.categoryname;
                  cards.push({id: cardFields.categoryid, categoryid: cardFields.categoryid, description: cardFields.cardname, 
                              username: cardFields.username, password: cardFields.password,
                              note: cardFields.note, url: cardFields.url, pincode: cardFields.pincode});
                }
                
                if (sectionTitle != "")
                  result.push({title: sectionTitle, count: cards.length, data: cards});

                return result;
            })
            .then(result => {
              resolve(result);
             })
            .catch(error => {
                console.error('error', error);
                reject(error);
            });
    });
  }
}

export default SysData;