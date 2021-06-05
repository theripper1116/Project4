public class SecondController {
    public SecondController(ApexPages.StandardController controller){
        
    }
    public void saveRecord(){
        System.debug('Save1 is clicked');
    }
    public void save(){
        System.debug('Save2 is clicked');
    }
}