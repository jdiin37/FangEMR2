package servlets;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.GzipUtilities;
import library.utility.MapUtil;
import library.utility.ServicesUtil;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * Created by jeffy on 2017/7/28.
 */
public class ServletAgentTest extends HttpServlet {

    private static final long serialVersionUID = 2L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public ServletAgentTest() {
        super();
    }

    @Override
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Boolean checkSuccess = true;
        JsonObject errorResults = new JsonObject();
        Map<String, Object> checkResult;
        String serviceName = "";
        String parameters = "";
        String methodName = "";
        ServletAdapter servletAdapter = null;
        JsonObject parametersJsObj = null;

        checkResult = ServicesUtil.checkRequestParameters(request);

        if (checkResult.get("status").equals("Success")) {
            serviceName = (String)checkResult.get("serviceName");
            methodName = (String)checkResult.get("methodName");
            parameters = (String)checkResult.get("parameters");
            servletAdapter = (ServletAdapter)checkResult.get("servletAdapter");
            try {
                parametersJsObj = (JsonObject) checkResult.get("parametersJsObj");
            } catch (Exception ex) {
                ex.printStackTrace();
            }

        } else {
            checkSuccess = false;
            errorResults = MapUtil.getFailureResult((String)checkResult.get("errorMessage"));
            System.out.println("ServicesUtil.checkRequestParameters error: " + errorResults.toString());
        }

        System.out.println("\nTime: " + LocalDateTime.now() +
                "\n    --> Request Service: " + serviceName +
                "\n    --> method: " + methodName +
                "\n    --> Parameters: " + parameters);


        // If Service is not AuthService then check empNo and sessionID
        if (checkSuccess) {
            if (!serviceName.equals("AuthService")) {
                String empNo = parametersJsObj.get("empNo").getAsString();
                long sessionID = parametersJsObj.get("sessionID").getAsLong();
                if (!ServicesUtil.checkPadLogonRec(empNo, sessionID)) {
                    checkSuccess = false;
                    String err = "Session Not available empNo: " + empNo + " sessionID: " + sessionID;
                    errorResults = MapUtil.getFailureResult(err);
                }
            }
        }

        // run ServletAdapter
        String returnJson = "";
        if (checkSuccess) {
            try {
                returnJson = servletAdapter.run(parametersJsObj);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        if (errorResults.size() != 0) {
            returnJson = errorResults.toString();
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
//        response.getWriter().write(returnJson);  // enable gzip when request

        // Change the definition of "printWriter" depending on whether or not gzip is supported and enabled.
        PrintWriter printWriter;
        if (GzipUtilities.canUsingGzip(request)) {
//            GzipUtilities.showNativeEncoding();
//            System.out.println("\nreturn Json: " + returnJson.substring(0, 300));
            response.setHeader("Content-Encoding", "gzip");
            printWriter = GzipUtilities.getGzipWriter(response);
            printWriter.write(returnJson);
            printWriter.close();
        } else {
//            System.out.println("\nreturn Json: " + returnJson.substring(0, 300));
            printWriter = response.getWriter();
            printWriter.write(returnJson);
            printWriter.close();
        }

        JsonObject jsonObject = MapUtil.strToJsonObject(returnJson);
        System.out.println("\nTime: " + LocalDateTime.now() +
                "\n    --> Response Service: " + serviceName +
                "\n    --> method: " + methodName +
                "\n    --> Status: " + jsonObject.get("status").getAsString());

        if (jsonObject.get("status").getAsString().equals("Failure")){
            System.out.println("\n    --> Error Message: " + jsonObject.get("errorMessage").getAsString());
        }
    }

    public static void main(String[] args) {
        //http://172.16.2.189:8080/KSPHTimaServices/servlets/ServletAgent?serviceName=InvService&parameters={"empNo":"KSPH","sessionID":1806,"method":"getPasstockByEmpNo"}
        String str = "{\"empNo\":\"KSPH\",\"sessionID\":1,\"method\":\"getPasstockByEmpNo\"}";

    }
}
