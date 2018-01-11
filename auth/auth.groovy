import groovy.json.JsonBuilder

import java.util.logging.Logger

import static Globals.logger
import static Globals.timings
import static groovy.json.JsonOutput.*


class Globals {
    static Logger logger = Logger.getLogger("")
    static List timings = []
}


result = [status: "SUCCESS"]
logger.info("Result: " + result)
//logger.info("Timing: " + prettyPrint(toJson(timings)))

def time = 0
timings.each { obj -> time += obj["time"] }
//logger.info("Total accounted time: " + time)

return result

/**
 * UTILITY METHODS
 */

static void setConnectionProperties(HttpURLConnection connection, URLConnectionCookieManager cookieManager) {
    // not to follow redirects automatically
    connection.setInstanceFollowRedirects(false)

    // add any cookies
    cookieManager.setCookiesFromCookieJar(connection)

    // set user-agent
    connection.setRequestProperty('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36')
}

static HttpURLConnection loadPageWithRedirects(String urlStr, URLConnectionCookieManager cookieManager) {
    HttpURLConnection connection = (HttpURLConnection) new URL(urlStr).openConnection()
    setConnectionProperties(connection, cookieManager)
    connection.setConnectTimeout(60000)
    return loadPageWithRedirects(connection, cookieManager)
}

static HttpURLConnection loadPageWithRedirects(HttpURLConnection connection, URLConnectionCookieManager cookieManager) {
    while (true) {
        def start = new Date().getTime()
        connection.getResponseCode()
        def end = new Date().getTime()

        def timing = [:]
        timing["url"] = connection.getURL()
        timing["result"] = connection.getResponseCode()
        timing["time"] = (end - start)
        timings.add(timing)

        // read response
        logger.info("Load URL: " + connection.getURL() + "\n" +
                " Got response: " + connection.getResponseCode() +
                " with message: " + connection.getResponseMessage() +
                " in " + (end - start) + "ms.")

        cookieManager.putCookiesInCookieJar(connection)
        logger.info("After request cookies:\n" + cookieManager.toString())

        // construct next URL to load
        def urlStr = connection.getHeaderField("Location")
        def url
        if (urlStr == null) {
            break // break out if there is no next URL
        } else {
            url = new URL(connection.getURL(), urlStr)
        }
        logger.info("Header Page URL:" + url)

        // create next connection
        connection = (HttpURLConnection) url.openConnection()
        setConnectionProperties(connection, cookieManager)
        connection.setConnectTimeout(60000)
    }

    return connection
}

static HttpURLConnection postForm(HttpURLConnection connection, URLConnectionCookieManager cookieManager,
                                  Map<String, String> params)
{
    setConnectionProperties(connection, cookieManager)
    connection.setRequestProperty('Content-Type', 'application/x-www-form-urlencoded')
    connection.setRequestMethod("POST")
    connection.doOutput = true

    String paramsString = ""

    boolean first = true
    for (Map.Entry<String, String> entry : params.entrySet()) {
        if (first) {
            first = false
        } else {
            paramsString += "&"
        }
        paramsString += entry.getKey() + "=" + URLEncoder.encode(entry.getValue(), 'UTF-8')
    }
    logger.info("Writing params: " + paramsString)

    def writer = new OutputStreamWriter(connection.outputStream)
    writer.write(paramsString)
    writer.flush()
    writer.close()

    return connection
}

/**
 * UTILITY CLASSES
 */

class URLConnectionCookieManager implements Serializable
{

    URLConnectionCookieManager()
    {
        this(null, null);
    }

    URLConnectionCookieManager(
            CookieStore cookieStore,
            CookiePolicy cookiePolicy)
    {
        CookieHandler cookieHandler = createCookieManager(cookieStore, cookiePolicy);
        setCookieManager(cookieHandler);
    }

    void putCookiesInCookieJar(
            URLConnection urlConnection) throws IOException
    {
        Map<String, List<String>> headers = urlConnection.getHeaderFields();
        URL url = urlConnection.getURL();

        URI uri = null;
        try
        {
            uri = url.toURI();
        }
        catch (URISyntaxException urise)
        {
            System.out.println("Unable to convert URL to URI while putting cookies in cookie jar.");
            throw new IOException(urise);
        }

        CookieManager cookieManager = getCookieManager();
        cookieManager.put(uri, headers);
    }

    void setCookiesFromCookieJar(
            URLConnection urlConnection) throws IOException
    {
        Map<String, List<String>> headerMap = new HashMap<String, List<String>>();

        URL url = urlConnection.getURL();

        URI uri = null;
        try
        {
            uri = url.toURI();
        }
        catch (URISyntaxException urise)
        {
            System.out.println("Unable to convert URL to URI while setting cookies from cookie jar.");
            throw new IOException(urise);
        }

        CookieManager cookieManager = getCookieManager();
        headerMap = cookieManager.get(uri, headerMap);

        int cookiesAdded = 0;
        String allCookies = "";

        Set<Map.Entry<String, List<String>>> headerSet = headerMap.entrySet();
        Iterator<Map.Entry<String, List<String>>> headerIterator = headerSet.iterator();
        boolean hasNextPair = headerIterator.hasNext();
        while (hasNextPair)
        {
            Map.Entry<String, List<String>> pair = headerIterator.next();
            String key = pair.getKey();
            List<String> cookieList = pair.getValue();

            Iterator<String> cookieIterator = cookieList.iterator();
            boolean hasNextCookie = cookieIterator.hasNext();
            while (hasNextCookie)
            {
                String cookie = cookieIterator.next();
                if (cookiesAdded > 0) {
                    allCookies += "; ";
                }
                allCookies += cookie;

                cookiesAdded++;
                hasNextCookie = cookieIterator.hasNext();
            }

            hasNextPair = headerIterator.hasNext();
        }

        urlConnection.addRequestProperty("Cookie", allCookies);
        logger.info("Added " + cookiesAdded + " cookies to request for " + uri.toString())
    }

    CookieManager getCookieManager()
    {
        return this.cookieManager_;
    }

    protected CookieManager createCookieManager(
            CookieStore cookieStore,
            CookiePolicy cookiePolicy)
    {
        CookieManager cookieManager = new CookieManager(cookieStore, cookiePolicy);
        return cookieManager;
    }

    protected void setCookieManager(
            CookieManager cookieManager)
    {
        this.cookieManager_ = cookieManager;
    }

    String toString() {
        String out = "";
        for (HttpCookie cookie : getCookieManager().getCookieStore().getCookies()) {
            out += "  " + cookie.getDomain() + " " + cookie.getName() + " " + cookie.getMaxAge() + "\n";
        }

        return out;
    }

    String getCookieString() {
        def cookies = []
        for (HttpCookie cookie : getCookieManager().getCookieStore().getCookies()) {
            cookies << [
                    domain: cookie.getDomain(),
                    name: cookie.getName(),
                    value: cookie.getValue(),
                    path: cookie.getPath(),
                    httponly: cookie.isHttpOnly(),
                    secure: cookie.getSecure(),
                    expires: cookie.getMaxAge() == -1 ? -1 : new Date().getTime() + (cookie.getMaxAge()*1000)
            ]
        }

        return new JsonBuilder(cookies).toString()
    }

    private CookieManager cookieManager_;
}
