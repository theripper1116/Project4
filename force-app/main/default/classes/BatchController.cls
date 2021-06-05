public class BatchController {    
    
    public void invoke(){
        /*AccountsBatchController abc = new AccountsBatchController();
          Id jobId = Database.executeBatch(abc, 5); //Default:200; Max: 2000;
        
          AsyncApexJob aaj = [SELECT Id, Status, JobItemsProcessed, TotalJobItems, NumberOfErrors 
                    FROM AsyncApexJob WHERE ID =: jobId];
		*/
        
        /*
        AccountSchedulable accsch = new AccountSchedulable();
        String sch = '00 00 1 12 8 ?';
        Id jobId = System.schedule('Slack Notification about PURGE', sch, accsch);
		*/

        /*
        FutureController.foobar();
        */
        
        QueueableApex qa = new QueueableApex();
        System.enqueueJob(qa);

        
    }
}