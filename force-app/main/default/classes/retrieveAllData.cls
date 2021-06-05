public with sharing class retrieveAllData {
    public retrieveAllData() {
    }     
    // @AuraEnabled(cacheable=true)
    // public static List<Opportunity> retrieveAllOpportunityRecords(String name){
    //     return [SELECT Name, StageName, Type, Amount FROM Opportunity WHERE Name LIKE '%name%'];
    // }
    @AuraEnabled
    public static List<Opportunity> retrieveAllOpportunityRecords(String search){
        String query='SELECT Name, Account.Name, StageName, Type, Amount FROM Opportunity';
        if(search != null && search !=' '){
            double amountValue=null;
            try{
                    amountValue=Integer.valueof(search);
                }
            
            catch(Exception e){
            }
            query+=' WHERE Name LIKE:search OR Account.Name LIKE:search OR StageName LIKE:search OR Type LIKE:search OR Amount = :amountValue';
        }
       
       
        
        
        // if(name!=null){
        //     String key1 = '%'+ name +'%';
        //     query+= ' Name LIKE:key1 OR';        
        // }
        // if(accName!=null){
        //     String key2 = '%'+ accName +'%';
        //     query+=' Account.Name LIKE:key2 OR'; 
        // }
        // if(stageName!=null){
        //     String key3 = '%'+ stageName +'%';
        //     query+=' StageName LIKE:key3 OR'; 
        // }
        // if(type!=null){
        //     String key4 = '%'+ type +'%';
        //     query+=' Type LIKE:key4 OR'; 
        // }        
        // if(amount!=null){
        //     String key5 = '%'+ amount +'%';
        //     query+=' Amount LIKE:key5 OR'; 
        // }
        return(Database.query(query));
    }
}