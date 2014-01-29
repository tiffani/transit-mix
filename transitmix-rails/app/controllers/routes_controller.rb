class RoutesController < ApplicationController
  layout nil

  before_action :set_mix, only: [:show, :edit, :update, :destroy, :create]
  before_action :set_route, only: [:show, :edit, :update, :destroy]

  protect_from_forgery with: :null_session

  # GET /routes
  # GET /routes.json
  def index
    @routes = Route.all
    render layout: false
  end

  # GET /routes/1
  # GET /routes/1.json
  def show
  end

  # GET /routes/new
  def new
    @route = Route.new
  end

  # GET /routes/1/edit
  def edit
  end

  # POST /routes
  # POST /routes.json
  def create
    @route = @mix.routes.build(name: params[:name], description: params[:description])
    @route.polyline = params['polyline']

    respond_to do |format|
      if @route.save
        format.html { redirect_to @route, notice: 'Route was successfully created.' }
        format.json { render action: 'show', status: :created, location: @route }
      else
        format.html { render action: 'new' }
        format.json { render json: @route.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /routes/1
  # PATCH/PUT /routes/1.json
  def update
    respond_to do |format|
      if @route.update(route_params)
        format.html { redirect_to @route, notice: 'Route was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @route.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /routes/1
  # DELETE /routes/1.json
  def destroy
    @route.destroy
    respond_to do |format|
      format.html { redirect_to routes_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_route
      @route = Route.find(params[:id])
    end

    def set_mix
      @mix = Mix.find(params[:mix_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def route_params
      params[:route]
    end
end
