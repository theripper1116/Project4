public with sharing class ContinuationController {
  public static String result {get;set;}
  private static String L_URL = 'https://jsonplaceholder.typicode.com/todos/';
  @AuraEnabled(cacheable=true continuation=true)
  public static Object startRequest(Integer numString) {
      Continuation con = new Continuation(40);
      con.continuationMethod='processResponse';
      HttpRequest req = new HttpRequest();
      req.setMethod('GET');
      string s1=string.valueof(numString);
      req.setEndpoint(L_URL + s1);
      System.debug('req->          ' + s1);
      con.addHttpRequest(req);
      System.debug('con->             ' + con.addHttpRequest(req));
      return con;  
  }


  @AuraEnabled(cacheable=true)
  public static Object processResponse(List<String> labels) {   
      HttpResponse response = Continuation.getResponse(labels[0]);
      result = response.getBody();
      System.debug(result);
      return result;
  }
}