local JSON = require("json")
local Dispatcher = require("dispatcher") -- luacheck:ignore
local InfoMessage = require("ui/widget/infomessage")
local UIManager = require("ui/uimanager")
local WidgetContainer = require("ui/widget/container/widgetcontainer")
local DataStorage = require("datastorage")

local statistics_dir = DataStorage:getDataDir() .. "/statistics/"
local db_location = DataStorage:getSettingsDir() .. "/statistics.sqlite3"

local POST_ENDPOINT = "http://localhost:3000/api/plugin" -- Change this to your endpoint

local Kobuddy = WidgetContainer:extend{
    name = "kobuddy"
}

function Kobuddy:onDispatcherRegisterActions()
    -- dispatcher:registeraction("kobuddy_sync", {
    --     category = "none",
    --     event = "KoBuddySync",
    --     title = _("KoBuddy"),
    --     general = true
    -- })
end

function Kobuddy:init()
    self:onDispatcherRegisterActions()
    self.ui.menu:registerToMainMenu(self)
end

function Kobuddy:read_progress_data()
    local db = sqlite3.open(DB_PATH)
    local data = {}

    if db then
        for row in db:nrows("SELECT * FROM progress") do
            table.insert(data, row)
        end
        db:close()
    else
        UIManager:show(InfoMessage:new{
            text = "Failed to open progress.db",
            timeout = 3
        })
    end

    return data
end

function Kobuddy:send_data(data)
    local json_data = JSON:encode(data)
    local tmp_path = "/tmp/progress_payload.json"

    -- Write to temp file
    local file = io.open(tmp_path, "w")
    if file then
        file:write(json_data)
        file:close()

        -- Send via curl
        local curl_cmd = string.format("curl -X POST -H 'Content-Type: application/json' --data-binary @%s '%s'",
            tmp_path, POST_ENDPOINT)

        local result = os.execute(curl_cmd)

        UIManager:show(InfoMessage:new{
            text = "Sync complete. Exit code: " .. tostring(result),
            timeout = 3
        })
    else
        UIManager:show(InfoMessage:new{
            text = "Failed to write JSON payload.",
            timeout = 3
        })
    end
end

function Kobuddy:addToMainMenu(menu_items)
    menu_items.kobuddy = {
        text = _("Kobuddy"),
        keep_menu_open = true,
        sub_item_table = {{
            text = _("About Kobuddy"),
            callback = function()
                UIManager:show(InfoMessage:new{
                    text = about_text
                })
            end,
            keep_menu_open = true,
            separator = true
        }}
    }
end

return Kobuddy
