local _ = require("gettext")
local callApi = require("call_api")
local InfoMessage = require("ui/widget/infomessage")
local JSON = require("json")
local KoInsightDbReader = require("db_reader")
local logger = require("logger")
local UIManager = require("ui/uimanager")

local API_ENDPOINT_LOCATION = "/api/plugin/import"

function getHeaders(body)
    local headers = {
        ["Content-Type"] = "application/json",
        ["Content-Length"] = tostring(#body)
    }
    return headers
end

function gather_data()
    local stats = KoInsightDbReader.progressData()
    local books = KoInsightDbReader.bookData()

    local body = {
        stats = stats,
        books = books
    }

    body = JSON.encode(body)
    return body
end

function render_response_message(response, prefix, default_text)
    local text = prefix .. " " .. default_text
    if response ~= nil and response['message'] ~= nil then
        logger.dbg("[KoInsight] API message received: ", JSON.encode(response))
        text = prefix .. " " .. response['message']
    end

    UIManager:show(InfoMessage:new{
        text = _(text)
    })
end

return function(server_url)
    if server_url == nil or server_url == "" then
        UIManager:show(InfoMessage:new{
            text = _("Please set the server URL first.")
        })
        return
    end

    local url = server_url .. API_ENDPOINT_LOCATION
    local body = gather_data()

    local ok, response = callApi("POST", url, getHeaders(body), body)

    if ok then
        render_response_message(response, "Success:", "Data uploaded.")
    else
        render_response_message(response, "Error:", "Data upload failed.")
    end
end
