public with sharing class ContinuationController {
    // Unique label corresponding to the continuation request
    public static List<String> requestLabel;
    // Result of callout
    public static String result {get;set;}
    // Endpoint of long-running service
    private static String L_URL = 'https://jsonplaceholder.typicode.com/todos/';
 
   // Action method
    @AuraEnabled(cacheable=true continuation=true)
    public static Object startRequest(String numString) {
 
        requestLabel = new List<String>();
      // Create continuation with a timeout
      Continuation con = new Continuation(40);
      // Set callback method
      con.continuationMethod='processResponse';
 
      // Create callout request
      HttpRequest req = new HttpRequest();
      req.setMethod('GET');
      req.setEndpoint(L_URL + numString);
 
      // Add callout request to continuation
      requestLabel.add(con.addHttpRequest(req));
 
      // Return the continuation
      System.debug('req1 ->               ' + requestLabel);
      return con;  
    }
 
    // Callback method 
    @AuraEnabled(cacheable=true)
    public static Object processResponse() {   
        System.debug(' 🚀 ' +requestLabel[0]);
      // Get the response by using the unique label
      HttpResponse response = Continuation.getResponse(requestLabel[0]);
      // Set the result variable that is displayed on the Visualforce page
      result = response.getBody();
 
      // Return null to re-render the original Visualforce page
      return result;
    }
}