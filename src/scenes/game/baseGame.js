import Scene from '../scene'
import gs from '../../config/gameStats'

export default class BaseGameScene extends Scene {
  constructor () {
    super({key: 'baseGameScene'})
  }
  

  create (params) {
    super.create(params)
    this.id = Math.random()
    this.laps = 0
    this.rotationRatio = gs.stats.mainScene.rotationRatio || params.rotation || 0.01
    
    this.sceneManager.addGameScene(this.scene.key)
    this.sceneManager.overlay('HUDGameScene')

    this.actorPosition = {
      x: gs.stats.mainScene.logoPosition.x || this.cameras.main.width/2,
      y: gs.stats.mainScene.logoPosition.y || this.cameras.main.height/2
    }

    this.actor = this.addActor(this.actorPosition.x, this.actorPosition.y, 'skeleton', 'skeleton-idle-001.png')
    this.actor.setScale(10);
    this.actor.setTint(params.color || 0xffffff)
    this.events.on('shutdown', () => {
      this.shutdown()
    }, this)


    
    // load gui
    if(this.constants.DAT_GUI_ENABLE) {     
      gs.setListener('mainScene.rotationRatio', (val) => {
        this.rotationRatio = val
      })
      gs.setListener('mainScene.logoPosition.x', (val) => {
        this.actor.x = val
      })
      gs.setListener('mainScene.logoPosition.y', (val) => {
        this.actor.y = val
      })
    }
  }

  shutdown() {
    this.events.off('shutdown')

    // gui
    if(this.constants.DAT_GUI_ENABLE) {
      gs.removeListener('mainScene.rotationRatio')
      gs.removeListener('mainScene.logoPosition.x')
      gs.removeListener('mainScene.logoPosition.y')
    }
  }

  update () {
    super.update()
    this.actor.rotation += this.rotationRatio
    if(this.actor.rotation>(Math.PI-0.1)) {
      this.laps++
      this.registry.set('laps', this.laps)
    }
    this.registry.set('angle', this.actor.rotation)

    if (this.laps == 2) {
      this.laps = 0
      this.registry.set('laps', this.laps)
      this.changeToScene('baseGameScene', {color: ~~(Math.random()*0xffffff), rotation: -this.rotationRatio})
    }

  }

  /**
    only for performance
  */
  updateCustomStats() {
    this.customTrackingStats.custom = this.laps
  }
}