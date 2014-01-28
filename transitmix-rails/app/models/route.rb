class Route < ActiveRecord::Base
	has_many :vertices, class_name: "Vertex"

	def polyline=(polyline)
		polyline.each { |vertex| vertices.build(longitude: vertex['lng'], latitude: vertex['lat']) }
	end
end
