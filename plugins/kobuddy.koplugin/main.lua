local _ = require("gettext")
local Dispatcher = require("dispatcher") -- luacheck:ignore
local InfoMessage = require("ui/widget/infomessage")
local logger = require("logger")
local onUpload = require("upload")
local UIManager = require("ui/uimanager")
local WidgetContainer = require("ui/widget/container/widgetcontainer")
local KobuddySettings = require("settings")

local Kobuddy = WidgetContainer:extend{
    name = "kobuddy",
    is_doc_only = false
}

function Kobuddy:init()
    self.ui.menu:registerToMainMenu(self)

    self.kobuddy_settings = KobuddySettings:new{}
end

function Kobuddy:addToMainMenu(menu_items)
    menu_items.kobuddy = {
        text = _("Kobuddy"),
        sorting_hint = "tools",
        sub_item_table = {{
            text = _("Configure Kobuddy"),
            keep_menu_open = true,
            callback = function()
                self.kobuddy_settings:editServerSettings()
            end
        }, {
            text = _("Synchronize"),
            separator = true,
            callback = function()
                onUpload(self.kobuddy_settings.server_url)
            end
        }, {
            text = _("About Kobuddy"),
            keep_menu_open = true,
            callback = function()
                UIManager:show(InfoMessage:new{
                    text = "KoBuddy is a plugin for Kobuddy instances. \nSee https://github.com/GeorgeSG/kobuddy."
                })
            end
        }}
    }
end

return Kobuddy
