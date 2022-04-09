/*
    RF: 28.11.2021 SQLIte 
     npm install --save react-native-sqlite-storage --legacy-peer-deps
     npm install --save @types/react-native-sqlite-storage --legacy-peer-deps
     npm install react-native-sqlcipher --save --legacy-peer-deps
*/

import * as React from 'react';
import SQLite, { ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage';
import createGuid from "react-native-create-guid";
import { RESULTS } from 'react-native-permissions';
import { requireNativeComponent } from 'react-native';
import { truncateSync } from 'fs-extra';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

export interface Card {
  categoryid: string|null;
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
export const DATABASE_NAME: string = 'PasswordRecall.db';

class SysData {
    private databaseName: string = "";
    private db: SQLiteDatabase | null;

    private ENCRYPT_KEY: string = "{B05B6A3B-AA72-44D7-B2DE-35EFC7B9443E}";

    private SQL_CREATE_USERS: string = "CREATE TABLE IF NOT EXISTS USERS" +
                                        "( " +
                                        "  USERID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                                        "  USERNAME VARCHAR(50) NOT NULL COLLATE NOCASE, " +
                                        "  PASSWORD VARCHAR(50) NOT NULL " +
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

    private SQL_UPDATE_CARD: string = "UPDATE CARDS SET DESCRIPTION=?,URL=?,USERNAME=?,PASSWORD=?,NOTE=?,CATEGORYID=? " +
                                      "  WHERE CARDID=?";

    private SQL_INSERT_CARD: string = "INSERT INTO CARDS (CARDID,CATEGORYID,DESCRIPTION,URL,USERNAME,PASSWORD,NOTE) " +
                                      " VALUES (?,?,?,?,?,?,?) ";
   
    private SQL_DELETE_CARD: string =  "DELETE FROM CARDS WHERE CARDID=?";

    private SQl_CATEGORIES: string = "SELECT CATEGORYID,DESCRIPTION FROM CATEGORIES " +
                                     " ORDER BY DESCRIPTION"; 

    private SQL_USER: string = "SELECT USERNAME FROM USERS WHERE USERNAME=? AND PASSWORD=?";
    private SQL_INSERT_USER: string = "INSERT INTO USERS (USERNAME,PASSWORD) VALUES (?,?) ";
                               
    constructor(databaseName: string)
    {
      this.databaseName = databaseName;

      this.db = null;
      console.debug("database name: " + this.databaseName);
    };


   async openDatabase(): Promise<boolean> {
      let success: boolean = false;
      await this.closeDatabase();

      console.debug('Open database ...');

      try {
        this.db = await SQLite.openDatabase({name: this.databaseName, key: this.ENCRYPT_KEY, createFromLocation: 1, location: 'Documents'});
        if ( this.db  != null) {
          await this.createTables(this.db);

          success = true;
          console.debug('Database opened',success);
        }
      } 
      catch (error) {
        console.error("Error on open database",error);
      }
     
      return success;
   }

   async closeDatabase(): Promise<void> {   
      console.debug("Closing database...");   
     
      if (this.db != null) {
        try {
          await this.db.close();
          this.db = null;
          console.debug("Database closed");
        } 
        catch (error) {
          console.debug("Database closed error: ",error);
        }
      }

      console.debug("Closing database exit");         
   }

   private async createTables(db: SQLiteDatabase) {
      if (!db)
        return;

      console.debug("Create tables if not exists ...");
      
      try {
        console.debug("Create tables USERS");
        db.executeSql(this.SQL_CREATE_USERS);

        console.debug("Create tables CARDS");
        db.executeSql(this.SQL_CREATE_CARDS);

        console.debug("Create tables CATEGORY");
        db.executeSql(this.SQL_CREATE_CATEGORY);
      } 
      catch (error) {
        console.debug("Error on create table",error);
      }

      console.debug("Table created");
   }

   getCards(): Promise<CardSection[]>  {
    return new Promise<CardSection[]>((resolve, reject) => {
        if (this.db != null)
        {
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
        }
    });
  }

  async updateCard(card: Card): Promise<boolean> {
    let success: boolean = false;
    
    if (this.db != null) {
      await this.db.transaction((resultset) => {
        resultset.executeSql(this.SQL_UPDATE_CARD,
                              [card.description, card.url, 
                               card.username, card.password, 
                               card.note, 
                               card.categoryid,
                               card.cardid],
                              (resultset, results) => {
            success = (results.rowsAffected > 0);            
          }
        )
      });
    }

    console.debug('Has updated card?',success);
    return success;
  }

  async insertCard(card: Card): Promise<boolean> {
    let success: boolean = false;
    
    if (this.db != null) {
      await this.db.transaction((resultset) => {
        resultset.executeSql(this.SQL_INSERT_CARD,
                              [card.cardid,card.categoryid,
                               card.description, card.url, 
                               card.username, card.password, 
                               card.note],
                              (resultset, results) => {
            success = (results.rowsAffected > 0);            
          }
        )
      });
    }

    console.debug('Has inserted card?',success);
    return success;
  }

  async deleteCard(cardid: string): Promise<boolean> {
    let success: boolean = false;
    
    if (this.db != null) {
      await this.db.transaction((resultset) => {
        resultset.executeSql(this.SQL_DELETE_CARD,[cardid],(resultset, results) => {
            success = (results.rowsAffected > 0);            
          }
        )
      });
    }

    console.debug('Has deleted card?',success);
    return success;
  }

  getCategoryTypes(): Promise<CategoryType[]>  {
    return new Promise<CategoryType[]>((resolve, reject) => {
      if (this.db)
      {
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
      }
    });
  }
   
  async existsUser(username: string, password: string): Promise<boolean> {
    let success: boolean = false;

    console.debug('Search from: ', username,password);

    if (this.db != null) {
        await this.db.transaction((resultset) => {
          resultset.executeSql(this.SQL_USER,[username,password],(resultset, results) => {
              success = (results.rows.length >= 1);            
            }
          );
        });
    }

    console.debug('Has found user?:', success);
    return success;
  }

  async insertUser(username: string, password: string): Promise<boolean> {
    let success: boolean = false;
  
    console.debug("Insert user:",username,password);

    if (this.db != null) {
      await this.db.transaction((resultset) => {
        resultset.executeSql(this.SQL_INSERT_USER,[username,password],(resultset, results) => {
            success = (results.rowsAffected > 0);
          }
        );
      });
    }
   
    console.debug('Has inserted user?:', success);
    return success;
  }
}

export default SysData;