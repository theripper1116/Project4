public class AccountsBatchController implements 
								Database.Batchable<SObject>, 
								Database.Stateful, 
								Database.AllowsCallouts{
    
    public Database.QueryLocator start(Database.BatchableContext jobId){
        //we will get the data. 50 million records;
        System.debug(' Batch in start method! ' );        
        return Database.getQueryLocator('SELECT Id, Name FROM Account');
    }

    public void execute(Database.BatchableContext jobId, List<Account> scope){
        //perform the business logic here 
        for(Account acc : scope){

        }
		//callout

    }
    public void finish(Database.BatchableContext jobId){
        //Post processing
        System.debug(' Batch is finished! ' );
        
        /*
         * ContactBatchController cbc = new ContactBatchController();
         * database.executeBatch(cbc);
         */ 
    }
}