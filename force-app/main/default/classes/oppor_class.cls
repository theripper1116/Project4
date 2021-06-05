public with sharing class oppor_class {    
 
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpps( String searchKey, String sortBy, String sortDirection) {
        String query = 'SELECT Id, Name,Account.Name,Stagename,Type,Amount FROM Opportunity';
        if ( searchKey != null && searchKey != '' ) {
            String key = '%' + searchKey + '%';
            double ms = null;
            try {
                ms = double.valueOf(searchKey);
              }
              Catch (exception e) {
                // it's not an Integer, try something else
              }     
            query += ' WHERE Name LIKE :key OR Stagename LIKE :key OR Type LIKE :key OR Amount = :ms OR Account.Name LIKE :key';
        }
        if ( sortBy != null && sortDirection != null ) {
            query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }
        return Database.query( query );
    }
}