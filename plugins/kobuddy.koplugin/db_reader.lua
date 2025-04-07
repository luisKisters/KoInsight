local SQ3 = require("lua-ljsqlite3/init")
local DataStorage = require("datastorage")

local db_location = DataStorage:getSettingsDir() .. "/statistics.sqlite3"

local KobuddyDbReader = {}

function KobuddyDbReader.bookData()
    local conn = SQ3.open(db_location)
    local result, rows = conn:exec("SELECT * FROM book")
    local books = {}

    for i = 1, rows do
        local book = {
            id = tonumber(result[1][i]),
            title = result[2][i],
            authors = result[3][i],
            notes = tonumber(result[4][i]),
            last_open = tonumber(result[5][i]),
            highlights = tonumber(result[6][i]),
            pages = tonumber(result[7][i]),
            series = result[8][i],
            language = result[9][i],
            md5 = result[10][i],
            total_read_time = tonumber(result[11][i]),
            total_read_pages = tonumber(result[12][i])
        }
        table.insert(books, book)
    end

    conn:close()
    return books
end

function KobuddyDbReader.progressData()
    local conn = SQ3.open(db_location)
    local result, rows = conn:exec("SELECT * FROM page_stat_data")
    local results = {}

    for i = 1, rows do
        table.insert(results, {
            id_book = tonumber(result[1][i]),
            page = tonumber(result[2][i]),
            start_time = tonumber(result[3][i]),
            duration = tonumber(result[4][i]),
            total_pages = tonumber(result[5][i])
        })
    end

    conn:close()
    return results
end

return KobuddyDbReader
