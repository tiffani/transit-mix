json.array!(@mixes) do |mix|
  json.extract! mix, :id, :name
  json.routes(mix.routes) do |route|
  	json.extract! route, :name, :description
  	json.polyline(route.vertices) do |vertex|
	json.lat vertex.latitude
	json.lng vertex.longitude
end
  end
end
