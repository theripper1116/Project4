@isTest
public class ContinuationControllerTest {
    public Static Map<String, HttpRequest> requests;
    public Static String requestLabel;
    public static testmethod void testWebService() {
        ContinuationController controller = new ContinuationController();
        Continuation conti = (Continuation)ContinuationController.startRequest(10);
        requests = conti.getRequests();
        HttpResponse response = new HttpResponse();
        response.setBody('Mock response body');   
        System.debug(' 🚀 ' +requests);        
    }
}