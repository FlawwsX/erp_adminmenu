local open = false

local requestId, requestData = 0, {}
local spectateInfo = { toggled = false, target = 0, targetPed = 0 }
local ShowNames, Cloack = false, false

CreateThread(function()
  while true do
    Wait(1000)
    if NetworkIsSessionStarted() then
      TriggerServerEvent('erp_adminmenu:playerJoined')
      return
    end
  end 
end)

RegisterKeyMapping("+openadminmenu", "Open Admin Menu", "keyboard", "F10")
RegisterCommand("-openadminmenu", function() end, false) -- Disables chat from opening.

RegisterCommand("+openadminmenu", function(source, args, rawCommand)
  TriggerServerEvent('erp_adminmenu:openAdminMenu')
end, false)

RegisterKeyMapping("+toggleclip", "Admin Clip", "keyboard", "PAGEDOWN")
RegisterCommand("-toggleclip", function() end, false) -- Disables chat from opening.

RegisterCommand("+toggleclip", function(source, args, rawCommand)
  TriggerServerEvent('erp_adminmenu:toggleyayeet')
end, false)

RegisterNetEvent('erp_adminmenu:openAdminMenu', function(playerCount, maxPlayerCount)
  open = not open
  SetNuiFocus(open, open)
  print("Admin menu open status:", open)
  SendReactMessage('setVisible', open) SendReactMessage('playerCount', playerCount) SendReactMessage('maxPlayerCount', maxPlayerCount)
end)

RegisterNUICallback('hideFrame', function(_, cb)
  open = not open
  SetNuiFocus(open, open)
  SendReactMessage('setVisible', open)
end)

RegisterNUICallback('playerList', function(data, cb)
  TriggerServerEvent('erp_adminmenu:playerList')
  cb({
    name = "Test",
    id = 1,
    steam = "",
    fivem = "",
    discord = "",
    note = ""
  })
end)

RegisterNetEvent('erp_adminmenu:playerList', function(sentData)
  SendReactMessage('playerList', sentData)
end)

RegisterNUICallback('noclip', function(data, cb)
  TriggerServerEvent('erp_adminmenu:toggleyayeet')
end)

RegisterNUICallback('banPlayer', function(data, cb)
  TriggerServerEvent('erp_adminmenu:banPlayer', data)
  cb(true)
end)

RegisterNUICallback('kickPlayer', function(data, cb)
  TriggerServerEvent('erp_adminmenu:kickPlayer', data.id, data.reason)
  cb(true)
end)

RegisterNUICallback('spectatePlayer', function(data, cb)
  ExecuteCommand('spectate '..data['id'])
  cb(true)
end)

RegisterNetEvent('erp_adminmenu:requestSpectate', function(targetPed, target, name)
    local targetPed = NetworkGetEntityFromNetworkId(targetPed)
    if DoesEntityExist(targetPed) then
        NetworkSetInSpectatorMode(true, targetPed)
        spectateInfo = { toggled = true, target = target, targetPed = targetPed }
        CreateThread(function()
            while spectateInfo['toggled'] do 
                Wait(1000)
                if not DoesEntityExist(targetPed) then
                    NetworkSetInSpectatorMode(false, targetPed)
                    spectateInfo = { toggled = false, target = 0, targetPed = 0 }
                    if GetResourceState('pma-voice') == 'started' then
                      exports['pma-voice']:setOverrideCoords(false)
                    end
                end
            end
        end)
    end
end)

RegisterNetEvent('erp_adminmenu:cancelSpectate', function()
  NetworkSetInSpectatorMode(false, spectateInfo['targetPed'])
  spectateInfo = { toggled = false, target = 0, targetPed = 0 }
  if GetResourceState('pma-voice') == 'started' then
    exports['erp-voice']:setOverrideCoords(false)
  end
end)

CreateThread(function()
  while true do Wait(0)
      if spectateInfo['toggled'] then
          local text = {}
          local targetPed = spectateInfo['targetPed']
          if DoesEntityExist(targetPed) then
              if GetResourceState('pma-voice') == 'started' then
                exports['erp-voice']:setOverrideCoords(GetEntityCoords(targetPed))
              end
              table.insert(text,"Health: ~r~"..GetEntityHealth(targetPed).."/"..GetEntityMaxHealth(targetPed))
              table.insert(text,"Armor: ~r~"..GetPedArmour(targetPed))
              table.insert(text,"Melee Modifier: ~r~"..GetPlayerMeleeWeaponDamageModifier(target))
              table.insert(text,"Weapon Modifier: ~r~"..GetPlayerWeaponDamageModifier(target))
              table.insert(text,"Vehicle Modifier: ~r~"..GetPlayerVehicleDamageModifier(target))
              if GetPlayerInvincible(target) then
                  table.insert(text,"Invincible: ~r~True")
              else
                  table.insert(text,"Invincible: ~r~False")
              end

              for i,theText in pairs(text) do
                  SetTextFont(0)
                  SetTextProportional(1)
                  SetTextScale(0.0, 0.30)
                  SetTextDropshadow(0, 0, 0, 0, 255)
                  SetTextEdge(1, 0, 0, 0, 255)
                  SetTextDropShadow()
                  SetTextOutline()
                  SetTextEntry("STRING")
                  AddTextComponentString(theText)
                  EndTextCommandDisplayText(0.25, 0.7+(i/30))
              end
          else
              Wait(500)
          end
      else
          Wait(1000)
      end
  end
end)

function SpectateInfo() return spectateInfo end
exports('SpectateInfo', SpectateInfo) -- exports['erp_adminmenu']:SpectateInfo()

RegisterNUICallback('gotoPlayer', function(data, cb)
  ExecuteCommand('goto '..data['id'])
  cb(true)
end)

RegisterNetEvent("erp_adminmenu:teleporttoplayer")
AddEventHandler("erp_adminmenu:teleporttoplayer", function(coords) SetEntityCoords(PlayerPedId(), coords.x, coords.y, coords.z, 1, 0, 0, 1) end)

RegisterNUICallback('tomePlayer', function(data, cb)
  ExecuteCommand('tome '..data['id'])
  cb(true)
end)

RegisterNUICallback('cloakPlayer', function(data, cb)
  TriggerServerEvent('erp_adminmenu:Cloak', data['id'])
  cb(true)
end)

RegisterNetEvent('erp_adminmenu:Cloak')
AddEventHandler('erp_adminmenu:Cloak', function(from)
    if from ~= nil then
        Cloack = not Cloack
        SetEntityVisible(PlayerPedId(), not Cloack, 0)
        SetLocalPlayerVisibleLocally(true)
        if Cloack then
          SetEntityAlpha(PlayerPedId(), 50, false)
        else
          ResetEntityAlpha(PlayerPedId())
        end 
    end
end)

CreateThread(function()
  while true do 
    Wait(0)
    if Cloack then
      local yayeetEntity = PlayerPedId()
      SetEntityVisible(yayeetEntity, false, false)
      SetLocalPlayerVisibleLocally(true)
      SetEntityAlpha(yayeetEntity, 50, false)
    else
      Wait(100)
    end
  end
end)

RegisterNUICallback('infoPlayer', function(data, cb)
  ExecuteCommand('rncheck '..tonumber(data['id']))
  cb(true)
end)

RegisterNetEvent('erp_adminmenu:rncheck')
AddEventHandler('erp_adminmenu:rncheck', function(from)
    if from ~= nil then
        TriggerServerEvent('erp_adminmenu:rncheck', from, GetNumResources(), GetRegisteredCommands(), {
            health = GetEntityHealth(PlayerPedId()),
            armor = GetPedArmour(PlayerPedId()),
            meleemodifier = GetPlayerMeleeWeaponDamageModifier(PlayerId()),
            weaponmodifier = GetPlayerWeaponDamageModifier(PlayerId()),
            vehmodifier = GetPlayerVehicleDamageModifier(PlayerId()),
            invincible = GetPlayerInvincible(PlayerId()),
            invincible2 = GetPlayerInvincible_2(PlayerId()),
        })
    end
end)

RegisterNetEvent('erp_adminmenu:numcheckresources')
AddEventHandler('erp_adminmenu:numcheckresources', function(id, sentNum, sentResources, moreInfo)
    if id and sentNum then
        if GetResourceState('mythic_notify') == 'started' then
          exports['mythic_notify']:SendAlert('inform', 'You have '..GetNumResources()..' resources and '..id..' has '..sentNum..' resources loaded.', 7500)
        end
        local resourceList = ""
        for i = 0, sentNum, 1 do
            local resource_name = GetResourceByFindIndex(i)
            if resource_name and GetResourceState(resource_name) == "started" then
                if i == 0 then resourceList = resource_name end
                resourceList = resourceList .. ', '..resource_name
            end
        end
        TriggerServerEvent('erp:addChatSystem', resourceList)
        local msg = 'Health: '..moreInfo['health']..' | Armor: '..moreInfo['armor']..' | Melee DMG Modifier: '..moreInfo['meleemodifier']..' | Weapon DMG Modifier: '..moreInfo['weaponmodifier']..' | Vehicle DMG Modifier: '..moreInfo['vehmodifier']..' | Invincible: '..tostring(moreInfo['invincible'])..', '..tostring(moreInfo['invincible2'])
        TriggerServerEvent('erp:addChatSystem', msg)
    end 
end)

RegisterNUICallback('healPlayer', function(data, cb)
  ExecuteCommand('revive '..tonumber(data['id']))
  cb(true)
end)

RegisterNUICallback('screenshotPlayer', function(data, cb)
  ExecuteCommand('screenshot '..tonumber(data['id']))
  cb(true)
end)

RegisterNUICallback('offlineBanPlayer', function(data, cb)
  TriggerServerEvent('erp_adminmenu:banPlayer:offline', data.time, data.name, data.reason, data.fivem, data.steam, data.discord, data.license, data.ip)
  cb(true)
end)

RegisterNUICallback('unbanId', function(data, cb)
  TriggerServerEvent('erp_adminmenu:unbanPlayer', data.id)
  cb(true)
end)

RegisterNUICallback('announce', function(data, cb)
  ExecuteCommand('announce '..data['message'])
  cb(true)
end)

RegisterNUICallback('spawnvehicle', function(data, cb)
  local plyPed = PlayerPedId()
  local coords = vec4(GetEntityCoords(plyPed), GetEntityHeading(plyPed))
  TriggerServerEvent('erp_adminmenu:spawnVehicle', coords, data['message'])
  cb(true)
end)

RegisterNUICallback('updateweather', function(data, cb)
  ExecuteCommand('weather '..data['message'])
  cb(true)
end)

RegisterNUICallback('tpwaypoint', function(data, cb)
  local WaypointHandle = GetFirstBlipInfoId(8)
  if DoesBlipExist(WaypointHandle) then
      local waypointCoords = GetBlipInfoIdCoord(WaypointHandle)
      for height = 1, 1000 do
          SetPedCoordsKeepVehicle(PlayerPedId(), waypointCoords["x"], waypointCoords["y"], height + 0.0)
          local foundGround, zPos = GetGroundZFor_3dCoord(waypointCoords["x"], waypointCoords["y"], height + 0.0)
          if foundGround then
              SetPedCoordsKeepVehicle(PlayerPedId(), waypointCoords["x"], waypointCoords["y"], height + 0.0)
              break
          end
          Citizen.Wait(5)
      end
      cb("Teleported to waypoint!")
  else
    cb("No waypoint set.")
  end
end)

local function TPCoords(x,y)
  if perms['openmenu'] then
      for height = 1, 1000 do
          SetPedCoordsKeepVehicle(PlayerPedId(), x, y, height + 0.0)
          local foundGround, zPos = GetGroundZFor_3dCoord(x, y, height + 0.0)
          if foundGround then
              SetPedCoordsKeepVehicle(PlayerPedId(), x, y, height + 0.0)
              break
          end
          Citizen.Wait(5)
      end
  end
end

local function TPCoords(x,y)
  for height = 1, 1000 do
    SetPedCoordsKeepVehicle(PlayerPedId(), x, y, height + 0.0)
    local foundGround, zPos = GetGroundZFor_3dCoord(x, y, height + 0.0)
    if foundGround then
      SetPedCoordsKeepVehicle(PlayerPedId(), x, y, height + 0.0)
      break
    end
    Citizen.Wait(5)
  end
end

RegisterNUICallback('tpcoords', function(data, cb)
  local result = data['message']
  if string.gsub(result, " ", "") == "" or result == "" then result = nil end
  if result ~= nil then
    if string.find(result, 'vector3') then
      local x, y = string.sub(result, 9):match("([^,]+),([^,]+)")
      cb("Teleporting!")
      TPCoords(tonumber(x), tonumber(y))
    elseif string.find(result, 'vec3') then
      local x, y = string.sub(result, 6):match("([^,]+),([^,]+)")
      cb("Teleporting!")
      TPCoords(tonumber(x), tonumber(y))
    elseif string.find(result, 'vector4') then
      local x, y = string.sub(result, 9):match("([^,]+),([^,]+)")
      cb("Teleporting!")
      TPCoords(tonumber(x), tonumber(y))
    elseif string.find(result, 'vec4') then
      local x, y = string.sub(result, 6):match("([^,]+),([^,]+)")
      cb("Teleporting!")
      TPCoords(tonumber(x), tonumber(y))
    else
      cb('Nothing I can do with that, sorry.')
    end
  else
    cb("Please provide valid coordinates.")
  end
end)

RegisterNUICallback('repairvehicle', function()
  local ped = PlayerPedId()
  local vehicle = GetVehiclePedIsIn(PlayerPedId(), true)
  if DoesEntityExist(vehicle) then
    SetVehicleEngineHealth(vehicle, 1000.0)
    SetVehicleBodyHealth(vehicle, 1000.0)
    SetVehiclePetrolTankHealth(vehicle, 4000.0)
    SetVehicleFixed(vehicle)
    SetVehicleDeformationFixed(vehicle)
    for i = 0, GetVehicleNumberOfWheels(vehicle) do
      SetVehicleTyreFixed(vehicle, i) 
    end
    SetVehicleDirtLevel(vehicle, 0.0)
  end
end)

RegisterNUICallback('changeplate', function(data, cb)
  SetVehicleNumberPlateText(GetVehiclePedIsIn(PlayerPedId(), false), data['message']) 
  cb(true)
end)

RegisterNUICallback('cleararea', function(data, cb)
  TriggerServerEvent('erp_adminmenu:cleararea', data['message'])
  cb(true)
end)

RegisterNetEvent('erp_adminmenu:cleararea')
AddEventHandler('erp_adminmenu:cleararea', function(coords, radius)
  ClearAreaLeaveVehicleHealth(coords.x, coords.y, coords.z, radius, false, false, false, false)
end)

RegisterNUICallback('deleteVehicle', function(data, cb)
  TriggerServerEvent('erp_adminmenu:deletevehicle')
  cb(true)
end)

RegisterNUICallback('deleteEntity', function(data, cb)
  TriggerServerEvent('erp_adminmenu:deleteentity')
  cb(true)
end)

RegisterNUICallback('deletePed', function(data, cb)
  TriggerServerEvent('erp_adminmenu:deleteped')
  cb(true)
end)

RegisterNUICallback('deleteAllVehicles', function(data, cb)
  TriggerServerEvent('erp_adminmenu:deleteallvehicles')
  cb(true)
end)

RegisterNUICallback('magicTrick', function(data, cb)
  Cloack = not Cloack
  SetEntityVisible(PlayerPedId(), not Cloack, 0)
  SetLocalPlayerVisibleLocally(true)
  if Cloack then
    SetEntityAlpha(PlayerPedId(), 50, false)
  else
    ResetEntityAlpha(PlayerPedId())
  end
  cb(true)
end)

RegisterNUICallback('playerNames', function(data, cb)
  ShowNames = not ShowNames
  cb(true)
end)

function SetWeaponDrops()
  local allPeds = GetGamePool('CPed')
  for i=1, #allPeds do
      local ped = allPeds[i]
      if DoesEntityExist(ped) then
          SetPedDropsWeaponsWhenDead(ped, false)
      end
  end
end

Citizen.CreateThread(function()
  while true do
    Citizen.Wait(15000)
    SetWeaponDrops()
    DisablePlayerVehicleRewards(PlayerId())
  end
end)

local function DrawText3DTalking(coords, text, textColor)
  local color = { r = 220, g = 220, b = 220, alpha = 255 }
  if textColor ~= nil then 
      color = {r = textColor[1] or 22, g = textColor[2] or 55, b = textColor[3] or 155, alpha = textColor[4] or 255}
  end

  local onScreen,_x,_y=World3dToScreen2d(coords.x,coords.y,coords.z)
  local px,py,pz=table.unpack(GetGameplayCamCoords())
  local dist = #(vector3(px,py,pz) - vector3(coords.x,coords.y,coords.z))

  local scale = (1/dist)*2
  local fov = (1/GetGameplayCamFov())*100
  local scale = scale*fov
  
  if onScreen then
      SetTextScale(0.0*scale, 0.35*scale)
      SetTextFont(0)
      SetTextProportional(1)
      SetTextColour(color.r, color.g, color.b, color.alpha)
      SetTextDropshadow(0, 0, 0, 0, 55)
      SetTextEdge(2, 0, 0, 0, 150)
      SetTextDropShadow()
      SetTextOutline()
      SetTextEntry("STRING")
      SetTextCentre(1)
      AddTextComponentString(text)
      DrawText(_x,_y)
  end
end

local waitTimerName = 1000

CreateThread(function()
  while true do
    if ShowNames then
      waitTimerName = 0
      local plyCoords = GetEntityCoords(PlayerPedId())
      local players = GetActivePlayers()
      for i=1, #players do
        local v = players[i]
        local ped = GetPlayerPed(v)
        if ped ~= nil and ped ~= 0 then
          local dist = #(plyCoords - GetEntityCoords(ped))
          if dist < 15 and IsEntityVisible(ped) then
            local x, y, z = table.unpack(GetEntityCoords(ped))
            local playerCoords = vector3(x, y, z + 0.95)
            if playerCoords ~= nil then
              if NetworkIsPlayerTalking(v) then
                DrawText3DTalking(playerCoords, GetPlayerName(v).." ("..GetPlayerServerId(v)..")", {66, 122, 219, 255})
              else
                DrawText3DTalking(playerCoords, GetPlayerName(v).." ("..GetPlayerServerId(v)..")", {255, 255, 255, 255})
              end
            end
          end
        end
      end
    else
      waitTimerName = 1000
    end
    Wait(waitTimerName)
  end
end)

--[[local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

RegisterCommand('show-nui', function()
  toggleNuiFrame(true)
  debugPrint('Show NUI frame')
end)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)

RegisterNUICallback('getClientData', function(data, cb)
  debugPrint('Data sent by React', json.encode(data))

-- Lets send back client coords to the React frame for use
  local curCoords = GetEntityCoords(PlayerPedId())

  local retData <const> = { x = curCoords.x, y = curCoords.y, z = curCoords.z }
  cb(retData)
end)]]