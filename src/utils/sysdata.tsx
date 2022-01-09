/*
    RF: 28.11.2021 SQLIte 
     npm install --save react-native-sqlite-storage --legacy-peer-deps
     npm install --save @types/react-native-sqlite-storage --legacy-peer-deps
     npm install react-native-sqlcipher --save --legacy-peer-deps
*/

import * as React from 'react';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import createGuid from "react-native-create-guid";

SQLite.DEBUG(false);
SQLite.enablePromise(true);

export interface Card {
  categoryid: string;
  cardid: string;
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

export interface CategoryType {
  categoryid: string;
  description: string;
}


export const CATEGORY_DEFAULT = "{EDCA3EA3-5064-407D-9099-B0CAEEA385DE}";
export const DATABASE_NAME: String = 'PasswordRecall.db';

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

    private SQL_UPDATE_CARD = "UPDATE CARDS SET DESCRIPTION=?,URL=?,USERNAME=?,PASSWORD=?,NOTE=?,CATEGORYID=? " +
                              "  WHERE CARDID=?";

    private SQL_INSERT_CARD = "INSERT INTO CARDS (CARDID,CATEGORYID,DESCRIPTION,URL,USERNAME,PASSWORD,NOTE) " +
                              " VALUES (?,?,?,?,?,?,?) ";
   
    private SQL_DELETE_CARD =  "DELETE FROM CARDS WHERE CARDID=?";

    private SQl_CATEGORIES = "SELECT CATEGORYID,DESCRIPTION FROM CATEGORIES " +
                             " ORDER BY DESCRIPTION"; 
                               
    constructor(databasename: string)
    {
      this.dabaseName = databasename;

      this.db = null;
      console.debug("database name: " + this.dabaseName);
    }

    async openDatabse(): boolean {
      let success: boolean = false;
      await this.closeDatabase();

      console.debug('Open database ...');
      // wait to open database
      await SQLite.openDatabase({name: this.dabaseName, key: this.ENCRYPT_KEY, createFromLocation: 1, location: 'Documents'})
          .then((DBConnection) => {
          this.db = DBConnection;
        // console.log('Database info',this.db); 
          this.createTables(this.db);
          success = true;

          console.debug('Database opened',success);
        }
        ).catch((error) => {
            success = false;
            console.error("Error on open database",error);

            throw new Error(error); //raise error
          }
        );
       
      return success;
   }

   closeDatabase(): void {
      if (this.db) {
        console.debug("Closing database ...");

        this.db.close().then((status) => {
          console.log("Database closed",status);
      }).catch((error) => {
        console.error("Error on close database",error);
      });

      this.db = null;
      } else {
        console.debug("Database was not opened");
      }
   }

   private createTables(db: SQLiteDatabase) {
      if (!db)
        return;

      console.debug("Create tables if not exists ...");
      
      db.executeSql(this.SQL_CREATE_USERS).catch((error) => {
        console.log("Error on create table",error);
      });

      db.executeSql(this.SQL_CREATE_CARDS).catch((error) => {
        console.debug("Error on create table",error);
      });

      db.executeSql(this.SQL_CREATE_CATEGORY).catch((error) => {
        console.debug("Error on create table",error);
      });

      console.debug("Table created");
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
                  const cardFields = {categoryid, cardid, cardname, url, username, password, note, pincode} = resultset.rows.item(i);
                 
                  if (lastsection == "")  
                    lastsection = sectionFields.categoryid;

                  if (lastsection != sectionFields.categoryid) {
                    lastsection = sectionFields.categoryid;
                    result.push({title: sectionTitle, count: cards.length, data: cards});
                  
                    sectionTitle = ""; 
                    cards = [];
                  }

                  sectionTitle = sectionFields.categoryname;

                  cards.push({categoryid: cardFields.categoryid, 
                              cardid: cardFields.cardid, 
                              description: cardFields.cardname, 
                              username: cardFields.username, 
                              password: cardFields.password,
                              note: cardFields.note, 
                              url: cardFields.url, 
                              pincode: cardFields.pincode});
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

  async updateCard(card: Card): boolean {
    let success: boolean = false;
    
    await this.db.transaction((resultset) => {
      resultset.executeSql(this.SQL_UPDATE_CARD,
                           [card.description, card.url, 
                            card.username, card.password, 
                            card.note, 
                            card.categoryid,
                            card.cardid],(resultset, results) => {
          console.debug('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            success = true;
            console.debug('Update ok');
          } 
          else {
            console.debug('Update Failed');
          }
        }
      );
    });

    return success;
  }

  async insertCard(card: Card): boolean {
    let success: boolean = false;
  
    await this.db.transaction((resultset) => {
      resultset.executeSql(this.SQL_INSERT_CARD,
                           [card.cardid, card.categoryid,
                            card.description, card.url, 
                            card.username, card.password, card.note],(resultset, results) => {
          console.debug('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            success = true;
            console.debug('Insert ok');
          } 
          else {
            console.debug('Insert Failed');
          }
        }
      );
    });
   
    return success;
  }

  async deleteCard(cardid: string): boolean {
    let success: boolean = false;
  
    await this.db.transaction((resultset) => {
      resultset.executeSql(this.SQL_DELETE_CARD,[cardid],(resultset, results) => {
          console.debug('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            success = true;
            console.debug('Delete ok');
          } 
          else {
            console.debug('Delete Failed');
          }
        }
      );
    });
   
    return success;
  }

  getCategoryTypes(): CategoryType[]  {
    return new Promise<CardSection[]>((resolve, reject) => {
      this.db.executeSql(this.SQl_CATEGORIES,[])
          .then(([resultset]) => {
              let result: CategoryType[] =[];

              for (let i = 0; i < resultset.rows.length; i++) {
                const categoryFields = {categoryid, description} = resultset.rows.item(i);

                result.push({categoryid: categoryFields.CATEGORYID, description: categoryFields.DESCRIPTION});
              }
              
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