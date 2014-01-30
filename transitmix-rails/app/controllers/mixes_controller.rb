class MixesController < ApplicationController
  protect_from_forgery with: :null_session
  respond_to :html, :json
  
  def edit
  end

  def show
  end

  def update
    @mix = Mix.find(params[:id])
    @mix.update_attributes(:name => params[:name])
  end

  def destroy
  end

  def new
  end

  def create
    mix = Mix.create(name: params[:name])
    respond_with(mix)
  end

  def index
    @mixes = Mix.all
  end

  def show
    @mix = Mix.find(params[:id])
  end
end
