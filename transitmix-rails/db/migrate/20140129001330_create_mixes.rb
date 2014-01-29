class CreateMixes < ActiveRecord::Migration
  def change
    create_table :mixes do |t|

      t.timestamps
    end
  end
end
