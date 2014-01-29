json.extract! @route, :id, :name, :description, :color
json.polyline(@route.vertices) do |vertex|
	json.lat vertex.latitude
	json.lng vertex.longitude
end
