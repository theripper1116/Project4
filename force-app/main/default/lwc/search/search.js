// import { LightningElement, wire } from 'lwc';
// import retrieveAllOpportunityRecords from "@salesforce/apex/retrieveAllData.retrieveAllOpportunityRecords";

// export default class Search extends LightningElement {
//     // for(let ele of selectedRecords){
//     //     sRecords[ele.Id]=ele;
//     //      for(let e in ele){
//     //          console.log(ele[e]);
//     //      }
//     //  }

//     search;
//     // accountName;
//     // stage;
//     // type;
//     // amount;
//     handleChange(e){
//         if(e.target.name==="search"){
//             this.search=e.target.value;
//         }
//         // if(e.target.name==="account_name"){
//         //     this.accountName=e.target.value;
//         // }
//         // if(e.target.name==="stage"){
//         //     this.stage=e.target.value;
//         // }
//         // if(e.target.name==="type"){
//         //     this.type=e.target.value;
//         // }
//         // if(e.target.name==="amount"){
//         //     this.amount=e.target.value;
//         // }
//     }
//     searchData(){
//         retrieveAllOpportunityRecords({name:this.search})
//         .then((data)=>{
//             console.log(data);
//         }).catch((error)=>{
//             console.log(error);
//      });
//     }
// }


import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpps from '@salesforce/apex/oppor_class.getOpps';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import startRequest from '@salesforce/apexContinuation/ContinuationController.startRequest';
 
const columns = [{
label: 'Name',
fieldName: 'ConName',
type: 'url',
typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}
},
{
label: 'Account Name',
fieldName: 'ConAcc',
type: 'url',
typeAttributes: {label: { fieldName: 'Account.Name' }, target: '_blank'}
},
{
label: 'Stage',
fieldName: 'StageName',
sortable: true
},
{
label: 'Type',
fieldName: 'Type',
sortable: true
},
{
label: 'Amount',
fieldName: 'Amount',
sortable: true
},
{type: "button", typeAttributes: {  
label: 'Send',  
name: 'Send',  
title: 'Send',  
disabled: false,  
value: 'Send',    
}}
];
 
export default class Oppor_page extends LightningElement {
@track value;
@track error;
@track data;
@api sortedDirection = 'asc';
@api sortedBy = 'Name';
@api searchKey = '';
@track error;
@track page = 1; 
@track items = []; 
@track allContacts = [];     
@track startingRecord = 1;
@track endingRecord = 0; 
@track pageSize = 10; 
@track succ_String = 'Success';
@track rej_String = 'Rejected';
@track totalRecountCount = 0;
@track totalPage = 0;
@track columns = columns;
 
@wire(getOpps, {searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection'})
wiredAccounts({ error, data }) {
 
    if (data) {        
        let contactsArray = [];        
        for (let row of data) {                
            const flattenedRow = {}
            let rowKeys = Object.keys(row);               
            rowKeys.forEach((rowKey) => {
                const singleNodeValue = row[rowKey];
                if(singleNodeValue.constructor === Object){
                    this._flatten(singleNodeValue, flattenedRow, rowKey)        
                }else{
                    flattenedRow[rowKey] = singleNodeValue;
                }                    
            });              
            contactsArray.push(flattenedRow);
        }
        let tempConList = [];         
        contactsArray.forEach((record) => {
            let tempConRec = Object.assign({}, record);  
            tempConRec.ConName = '/' + tempConRec.Id;
            tempConRec.ConAcc = '/' + tempConRec.AccountId;
            tempConList.push(tempConRec);            
        });
        contactsArray = tempConList;    
        this.items = contactsArray;
        this.totalRecountCount = contactsArray.length;         
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
        this.allContacts = this.items.slice(0,this.pageSize);      
        this.endingRecord = this.pageSize;
        this.columns = columns;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.data = undefined;
    }    
}
 
_flatten = (nodeValue, flattenedRow, nodeName) => {        
    let rowKeys = Object.keys(nodeValue);
    rowKeys.forEach((key) => {
        let finalKey = nodeName + '.'+ key;
        flattenedRow[finalKey] = nodeValue[key];
    })
}
 
previousHandler() {
    if (this.page > 1) {
        this.page = this.page - 1; 
        this.displayRecordPerPage(this.page);
    }
}
 
nextHandler() {
    if((this.page<this.totalPage) && this.page !== this.totalPage){
        this.page = this.page + 1; 
        this.displayRecordPerPage(this.page);            
    }             
}
 
displayRecordPerPage(page){
    this.startingRecord = ((page -1) * this.pageSize) ;
    this.endingRecord = (this.pageSize * page);
    this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                        ? this.totalRecountCount : this.endingRecord; 
    this.allContacts = this.items.slice(this.startingRecord, this.endingRecord);
    this.startingRecord = this.startingRecord + 1;
}    
 
sortColumns( event ) {
    this.sortedBy = event.detail.fieldName;
    this.sortedDirection = event.detail.sortDirection;
    return refreshApex(this.result);    
}
 
handleKeyChange( event ) {
    this.searchKey = event.target.value;
    console.log(this.searchKey);
    return refreshApex(this.result);
}
 
 
callRowAction( event ) {  
    const recId =  event.detail.row.Id;  
    console.log(recId);
    const actionName = event.detail.action.name;  
    console.log(actionName);  
    if(actionName == "Send"){
        console.log((Math.ceil(Math.random() * 100)) + 1);
        startRequest({numString: (Math.ceil(Math.random() * 100)) + 1})
        .then((result) =>{
            console.log('abc');
            console.log(result);
            const myObj = JSON.parse(result);
            console.log(myObj.completed);
            if(myObj.completed){
                let record = {
                    fields: {
                        Id: recId,
                        Integration_Comments__c: 'Success',
                        Integration_Status__c: 'Success' ,
                    },
                };
                updateRecord(record).then(() => {
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Integration Status and Integration Comment Updated',
                        variant: 'success',
                    });
                    this.dispatchEvent(event);
                }).catch(() => {
                    const event = new ShowToastEvent({
                        title: 'Reject',
                        message: 'Unable to Update, Please try again later!!!',
                        variant: 'error',
                    });
                    this.dispatchEvent(event);
                });
            }else{
                let record = {
                    fields: {
                        Id: recId,
                        Integration_Comments__c: 'Reject',
                        Integration_Status__c: 'Reject' ,
                    },
                };
                updateRecord(record).then(() => {
                    const event = new ShowToastEvent({
                        title: 'Reject',
                        message: 'Integration Status and Integration Comment Updated',
                        variant: 'error',
                    });
                    this.dispatchEvent(event);
                }).catch(() => {
                    const event = new ShowToastEvent({
                        title: 'Reject',
                        message: 'Unable to Update, Please try again later!!!',
                        variant: 'error',
                    });
                    this.dispatchEvent(event);
                });
            }
        })
        .catch(error =>{
            console.log('xyz');
            console.log(error);
            this.error = error;
        });
    }             
}
}