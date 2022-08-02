import {
  Loader,
  LoaderUtils,
  FileLoader,
  ImageBitmapLoader,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  BufferAttribute,
  PropertyBinding,
  BufferGeometry,
  Mesh,
  Group,
  Bone,
  Object3D,
  Matrix4,
  Skeleton,
  TriangleFanDrawMode,
  TriangleStripDrawMode,
} from "three";

export interface GLTF {
  scene: Group;
}

/**
 * Original GLTFLoader Custom Tailored to our needs
 * Removed - Material Generation, Morphing, skinning, animations, Texture loading, gltf Json loading and additional calculations which are not needed for loading boat model
 */
class GLTFLoader extends Loader {
  pluginCallbacks: any[];
  constructor(manager) {
    super(manager);
    this.pluginCallbacks = [];
  }

  load(
    url,
    onLoad?: (response: GLTF) => void,
    onProgress?: (request: ProgressEvent<EventTarget>) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    const scope = this;
    let resourcePath;

    if (this.resourcePath !== "") {
      resourcePath = this.resourcePath;
    } else if (this.path !== "") {
      resourcePath = this.path;
    } else {
      resourcePath = LoaderUtils.extractUrlBase(url);
    } // Tells the LoadingManager to track an extra item, which resolves after
    // the model is fully loaded. This means the count of items loaded will
    // be incorrect, but ensures manager.onLoad() does not fire early.

    this.manager.itemStart(url);

    const _onError = function (e) {
      if (onError) {
        onError(e);
      } else {
        console.error(e);
      }

      scope.manager.itemError(url);
      scope.manager.itemEnd(url);
    };

    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType("arraybuffer");
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    loader.load(
      url,
      function (data) {
        try {
          scope.parse(
            data,
            resourcePath,
            function (gltf) {
              onLoad(gltf);
              scope.manager.itemEnd(url);
            },
            _onError
          );
        } catch (e) {
          _onError(e);
        }
      },
      onProgress,
      _onError
    );
  }

  setDDSLoader() {
    throw new Error(
      'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'
    );
  }

  register(callback) {
    if (this.pluginCallbacks.indexOf(callback) === -1) {
      this.pluginCallbacks.push(callback);
    }

    return this;
  }

  unregister(callback) {
    if (this.pluginCallbacks.indexOf(callback) !== -1) {
      this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);
    }

    return this;
  }

  parse(data, path, onLoad, onError) {
    let content;
    const extensions = {};
    const plugins = {};

    const magic = LoaderUtils.decodeText(new Uint8Array(data, 0, 4));

    try {
      extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
    } catch (error) {
      if (onError) onError(error);
      return;
    }

    content = extensions[EXTENSIONS.KHR_BINARY_GLTF].content;

    const json = JSON.parse(content);

    if (json.asset === undefined || json.asset.version[0] < 2) {
      if (onError)
        onError(
          new Error(
            "THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."
          )
        );
      return;
    }

    const parser = new GLTFParser(json, {
      path: path || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
    });

    for (let i = 0; i < this.pluginCallbacks.length; i++) {
      const plugin = this.pluginCallbacks[i](parser);
      plugins[plugin.name] = plugin; // Workaround to avoid determining as unknown extension
      // in addUnknownExtensionsToUserData().
      // Remove this workaround if we move all the existing
      // extension handlers to plugin system

      extensions[plugin.name] = true;
    }
    parser.setExtensions(extensions);
    parser.setPlugins(plugins);
    parser.parse(onLoad, onError);
  }

  parseAsync(data, path) {
    const scope = this;
    return new Promise(function (resolve, reject) {
      scope.parse(data, path, resolve, reject);
    });
  }
}
/* GLTFREGISTRY */

class GLTFRegistry {
  objects = {};
  get(key: string) {
    return this.objects[key];
  }
  add(key: string, object: any) {
    this.objects[key] = object;
  }
  remove(key: string) {
    delete this.objects[key];
  }
  removeAll() {
    this.objects = {};
  }
}
/*********************************/

/********** EXTENSIONS ***********/

/*********************************/

const EXTENSIONS = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: "KHR_materials_pbrSpecularGlossiness",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
};
/* BINARY EXTENSION */

const BINARY_EXTENSION_HEADER_MAGIC = "glTF";
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = {
  JSON: 0x4e4f534a,
  BIN: 0x004e4942,
};

class GLTFBinaryExtension {
  name: string;
  content: any;
  body: any;
  header: { magic: string; version: number; length: number };
  constructor(data) {
    this.name = EXTENSIONS.KHR_BINARY_GLTF;
    this.content = null;
    this.body = null;
    const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
    this.header = {
      magic: LoaderUtils.decodeText(new Uint8Array(data.slice(0, 4))),
      version: headerView.getUint32(4, true),
      length: headerView.getUint32(8, true),
    };

    if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    } else if (this.header.version < 2.0) {
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    }

    const chunkContentsLength =
      this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
    const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
    let chunkIndex = 0;

    while (chunkIndex < chunkContentsLength) {
      const chunkLength = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;
      const chunkType = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;

      if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
        const contentArray = new Uint8Array(
          data,
          BINARY_EXTENSION_HEADER_LENGTH + chunkIndex,
          chunkLength
        );
        this.content = LoaderUtils.decodeText(contentArray);
      } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
        const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
        this.body = data.slice(byteOffset, byteOffset + chunkLength);
      } // Clients must ignore chunks with unknown types.

      chunkIndex += chunkLength;
    }

    if (this.content === null) {
      throw new Error("THREE.GLTFLoader: JSON content not found.");
    }
  }
}
/*********************************/

/********** INTERNALS ************/

/*********************************/

/* CONSTANTS */

const WEBGL_CONSTANTS = {
  FLOAT: 5126,
  //FLOAT_MAT2: 35674,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  LINEAR: 9729,
  REPEAT: 10497,
  SAMPLER_2D: 35678,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  UNSIGNED_BYTE: 5121,
  UNSIGNED_SHORT: 5123,
};
const WEBGL_COMPONENT_TYPES = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array,
};
const WEBGL_TYPE_SIZES = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};
const ATTRIBUTES = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv2",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex",
};

function createPrimitiveKey(primitiveDef) {
  const dracoExtension =
    primitiveDef.extensions &&
    primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION];
  let geometryKey;

  geometryKey =
    primitiveDef.indices +
    ":" +
    createAttributesKey(primitiveDef.attributes) +
    ":" +
    primitiveDef.mode;

  return geometryKey;
}

function createAttributesKey(attributes) {
  let attributesKey = "";
  const keys = Object.keys(attributes).sort();

  for (let i = 0, il = keys.length; i < il; i++) {
    attributesKey += keys[i] + ":" + attributes[keys[i]] + ";";
  }

  return attributesKey;
}

/* GLTF PARSER */
class GLTFParser {
  fileLoader: any;
  json: { [key: string]: any };
  extensions: {};
  plugins: {};
  options: { [key: string]: any };
  cache: any;
  associations: Map<any, any>;
  primitiveCache: {};
  meshCache: { refs: {}; uses: {} };
  cameraCache: { refs: {}; uses: {} };
  lightCache: { refs: {}; uses: {} };
  textureCache: {};
  nodeNamesUsed: {};
  textureLoader: ImageBitmapLoader;
  constructor(json = {}, options = {}) {
    this.json = json;
    this.extensions = {};
    this.plugins = {};
    this.options = options; // loader object cache

    this.cache = new GLTFRegistry(); // associations between Three.js objects and glTF elements

    this.associations = new Map(); // BufferGeometry caching

    this.primitiveCache = {}; // Object3D instance caches

    this.meshCache = {
      refs: {},
      uses: {},
    };
    this.nodeNamesUsed = {};
  }

  setExtensions(extensions) {
    this.extensions = extensions;
  }

  setPlugins(plugins) {
    this.plugins = plugins;
  }

  parse(onLoad, onError) {
    const parser = this;
    const json = this.json;

    this.cache.removeAll(); // Mark the special nodes/meshes in json for efficient parse

    this._invokeAll(function (ext) {
      return ext._markDefs && ext._markDefs();
    });

    Promise.all(
      this._invokeAll(function (ext) {
        return ext.beforeRoot && ext.beforeRoot();
      })
    )
      .then(function () {
        return Promise.all([parser.getDependencies("scene")]);
      })
      .then(function (dependencies) {
        const result = {
          scene: dependencies[0][json.scene || 0],
          scenes: dependencies[0],
          parser: parser,
          userData: {},
        };
        Promise.all(
          parser._invokeAll(function (ext) {
            return ext.afterRoot && ext.afterRoot(result);
          })
        ).then(function () {
          onLoad(result);
        });
      })
      .catch(onError);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */

  _markDefs() {
    const nodeDefs = this.json.nodes || [];

    for (
      let nodeIndex = 0, nodeLength = nodeDefs.length;
      nodeIndex < nodeLength;
      nodeIndex++
    ) {
      const nodeDef = nodeDefs[nodeIndex];

      if (nodeDef.mesh !== undefined) {
        this._addNodeRef(this.meshCache, nodeDef.mesh); // Nothing in the mesh definition indicates whether it is
        // a SkinnedMesh or Mesh. Use the node's mesh reference
        // to mark SkinnedMesh if node has skin.
      }
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */

  _addNodeRef(cache, index) {
    if (index === undefined) return;

    if (cache.refs[index] === undefined) {
      cache.refs[index] = cache.uses[index] = 0;
    }

    cache.refs[index]++;
  }
  /** Returns a reference to a shared resource, cloning it if necessary. */

  _getNodeRef(cache, index, object) {
    if (cache.refs[index] <= 1) return object;
    const ref = object.clone(); // Propagates mappings to the cloned object, prevents mappings on the
    // original object from being lost.

    const updateMappings = (original, clone) => {
      const mappings = this.associations.get(original);

      if (mappings != null) {
        this.associations.set(clone, mappings);
      }

      for (const [i, child] of original.children.entries()) {
        updateMappings(child, clone.children[i]);
      }
    };

    updateMappings(object, ref);
    ref.name += "_instance_" + cache.uses[index]++;
    return ref;
  }

  _invokeOne(func) {
    const extensions = Object.values(this.plugins);
    extensions.push(this);

    for (let i = 0; i < extensions.length; i++) {
      const result = func(extensions[i]);
      if (result) return result;
    }

    return null;
  }

  _invokeAll(func) {
    const extensions = Object.values(this.plugins);
    extensions.unshift(this);
    const pending = [];

    for (let i = 0; i < extensions.length; i++) {
      const result = func(extensions[i]);
      if (result) pending.push(result);
    }

    return pending;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */

  getDependency(type, index) {
    const cacheKey = type + ":" + index;
    let dependency = this.cache.get(cacheKey);

    if (!dependency) {
      switch (type) {
        case "scene":
          dependency = this.loadScene(index);
          break;

        case "node":
          dependency = this.loadNode(index);
          break;

        case "mesh":
          dependency = this._invokeOne(function (ext) {
            return ext.loadMesh && ext.loadMesh(index);
          });
          break;

        case "accessor":
          dependency = this.loadAccessor(index);
          break;

        case "bufferView":
          dependency = this._invokeOne(function (ext) {
            return ext.loadBufferView && ext.loadBufferView(index);
          });
          break;

        case "buffer":
          dependency = this.loadBuffer(index);
          break;

        default:
          throw new Error("Unknown type: " + type);
      }

      this.cache.add(cacheKey, dependency);
    }

    return dependency;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */

  getDependencies(type) {
    let dependencies = this.cache.get(type);

    if (!dependencies) {
      const parser = this;
      const defs = this.json[type + (type === "mesh" ? "es" : "s")] || [];
      dependencies = Promise.all(
        defs.map(function (def, index) {
          return parser.getDependency(type, index);
        })
      );
      this.cache.add(type, dependencies);
    }

    return dependencies;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */

  loadBuffer(bufferIndex) {
    const bufferDef = this.json.buffers[bufferIndex];
    const loader = this.fileLoader;

    if (bufferDef.type && bufferDef.type !== "arraybuffer") {
      throw new Error(
        "THREE.GLTFLoader: " + bufferDef.type + " buffer type is not supported."
      );
    } // If present, GLB container is required to be the first buffer.

    if (bufferDef.uri === undefined && bufferIndex === 0) {
      return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
    }

    const options = this.options;
    return new Promise(function (resolve, reject) {
      loader.load(
        LoaderUtils.resolveURL(bufferDef.uri, options.path),
        resolve,
        undefined,
        function () {
          reject(
            new Error(
              'THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'
            )
          );
        }
      );
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */

  loadBufferView(bufferViewIndex) {
    const bufferViewDef = this.json.bufferViews[bufferViewIndex];
    return this.getDependency("buffer", bufferViewDef.buffer).then(function (
      buffer
    ) {
      const byteLength = bufferViewDef.byteLength || 0;
      const byteOffset = bufferViewDef.byteOffset || 0;
      return buffer.slice(byteOffset, byteOffset + byteLength);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */

  loadAccessor(accessorIndex) {
    const parser = this;
    const json = this.json;
    const accessorDef = this.json.accessors[accessorIndex];

    if (
      accessorDef.bufferView === undefined &&
      accessorDef.sparse === undefined
    ) {
      // Ignore empty accessors, which may be used to declare runtime
      // information about attributes coming from another source (e.g. Draco
      // compression extension).
      return Promise.resolve(null);
    }

    const pendingBufferViews = [];

    if (accessorDef.bufferView !== undefined) {
      pendingBufferViews.push(
        this.getDependency("bufferView", accessorDef.bufferView)
      );
    } else {
      pendingBufferViews.push(null);
    }

    if (accessorDef.sparse !== undefined) {
      pendingBufferViews.push(
        this.getDependency("bufferView", accessorDef.sparse.indices.bufferView)
      );
      pendingBufferViews.push(
        this.getDependency("bufferView", accessorDef.sparse.values.bufferView)
      );
    }

    return Promise.all(pendingBufferViews).then(function (bufferViews) {
      const bufferView = bufferViews[0];
      const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
      const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType]; // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.

      const elementBytes = TypedArray.BYTES_PER_ELEMENT;
      const itemBytes = elementBytes * itemSize;
      const byteOffset = accessorDef.byteOffset || 0;
      const byteStride =
        accessorDef.bufferView !== undefined
          ? json.bufferViews[accessorDef.bufferView].byteStride
          : undefined;
      const normalized = accessorDef.normalized === true;
      let array, bufferAttribute; // The buffer is not interleaved if the stride is the item size in bytes.

      if (byteStride && byteStride !== itemBytes) {
        // Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
        // This makes sure that IBA.count reflects accessor.count properly
        const ibSlice = Math.floor(byteOffset / byteStride);
        const ibCacheKey =
          "InterleavedBuffer:" +
          accessorDef.bufferView +
          ":" +
          accessorDef.componentType +
          ":" +
          ibSlice +
          ":" +
          accessorDef.count;
        let ib = parser.cache.get(ibCacheKey);

        if (!ib) {
          array = new TypedArray(
            bufferView,
            ibSlice * byteStride,
            (accessorDef.count * byteStride) / elementBytes
          ); // Integer parameters to IB/IBA are in array elements, not bytes.

          ib = new InterleavedBuffer(array, byteStride / elementBytes);
          parser.cache.add(ibCacheKey, ib);
        }

        bufferAttribute = new InterleavedBufferAttribute(
          ib,
          itemSize,
          (byteOffset % byteStride) / elementBytes,
          normalized
        );
      } else {
        if (bufferView === null) {
          array = new TypedArray(accessorDef.count * itemSize);
        } else {
          array = new TypedArray(
            bufferView,
            byteOffset,
            accessorDef.count * itemSize
          );
        }

        bufferAttribute = new BufferAttribute(array, itemSize, normalized);
      } // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors

      if (accessorDef.sparse !== undefined) {
        const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
        const TypedArrayIndices =
          WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
        const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
        const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
        const sparseIndices = new TypedArrayIndices(
          bufferViews[1],
          byteOffsetIndices,
          accessorDef.sparse.count * itemSizeIndices
        );
        const sparseValues = new TypedArray(
          bufferViews[2],
          byteOffsetValues,
          accessorDef.sparse.count * itemSize
        );

        if (bufferView !== null) {
          // Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
          bufferAttribute = new BufferAttribute(
            bufferAttribute.array.slice(),
            bufferAttribute.itemSize,
            bufferAttribute.normalized
          );
        }

        for (let i = 0, il = sparseIndices.length; i < il; i++) {
          const index = sparseIndices[i];
          bufferAttribute.setX(index, sparseValues[i * itemSize]);
          if (itemSize >= 2)
            bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
          if (itemSize >= 3)
            bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
          if (itemSize >= 4)
            bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
          if (itemSize >= 5)
            throw new Error(
              "THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute."
            );
        }
      }

      return bufferAttribute;
    });
  }
  /** When Object3D instances are targeted by animation, they need unique names. */

  createUniqueName(originalName) {
    const sanitizedName = PropertyBinding.sanitizeNodeName(originalName || "");
    let name = sanitizedName;

    for (let i = 1; this.nodeNamesUsed[name]; ++i) {
      name = sanitizedName + "_" + i;
    }

    this.nodeNamesUsed[name] = true;
    return name;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */

  loadGeometries(primitives) {
    const parser = this;
    const extensions = this.extensions;
    const cache = this.primitiveCache;

    function createDracoPrimitive(primitive) {
      return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
        .decodePrimitive(primitive, parser)
        .then(function (geometry) {
          return addPrimitiveAttributes(geometry, primitive, parser);
        });
    }

    const pending = [];

    for (let i = 0, il = primitives.length; i < il; i++) {
      const primitive = primitives[i];
      const cacheKey = createPrimitiveKey(primitive); // See if we've already created this geometry

      const cached = cache[cacheKey];

      if (cached) {
        // Use the cached geometry if it exists
        pending.push(cached.promise);
      } else {
        let geometryPromise;

        if (
          primitive.extensions &&
          primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
        ) {
          // Use DRACO geometry if available
          geometryPromise = createDracoPrimitive(primitive);
        } else {
          // Otherwise create a new geometry
          geometryPromise = addPrimitiveAttributes(
            new BufferGeometry(),
            primitive,
            parser
          );
        } // Cache this geometry

        cache[cacheKey] = {
          primitive: primitive,
          promise: geometryPromise,
        };
        pending.push(geometryPromise);
      }
    }

    return Promise.all(pending);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh>}
   */

  loadMesh(meshIndex) {
    const parser = this;
    const json = this.json;
    const meshDef = json.meshes[meshIndex];
    const primitives = meshDef.primitives;
    const pending = [];

    pending.push(parser.loadGeometries(primitives));
    return Promise.all(pending).then(function (results) {
      const geometries = results[results.length - 1];
      const meshes = [];

      for (let i = 0, il = geometries.length; i < il; i++) {
        const geometry = geometries[i];
        const primitive = primitives[i]; // 1. create Mesh

        let mesh;

        if (
          primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
          primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
          primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
          primitive.mode === undefined
        ) {
          mesh = new Mesh(geometry, undefined);

          if (
            mesh.isSkinnedMesh === true &&
            !mesh.geometry.attributes.skinWeight.normalized
          ) {
            // we normalize floating point skin weight array to fix malformed assets (see #15319)
            // it's important to skip this for non-float32 data since normalizeSkinWeights assumes non-normalized inputs
            mesh.normalizeSkinWeights();
          }

          if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
            mesh.geometry = toTrianglesDrawMode(
              mesh.geometry,
              TriangleStripDrawMode
            );
          } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
            mesh.geometry = toTrianglesDrawMode(
              mesh.geometry,
              TriangleFanDrawMode
            );
          }
        } else {
          throw new Error(
            "THREE.GLTFLoader: Primitive mode unsupported: " + primitive.mode
          );
        }

        mesh.name = parser.createUniqueName(
          meshDef.name || "mesh_" + meshIndex
        );
        meshes.push(mesh);
      }

      for (let i = 0, il = meshes.length; i < il; i++) {
        parser.associations.set(meshes[i], {
          meshes: meshIndex,
          primitives: i,
        });
      }

      if (meshes.length === 1) {
        return meshes[0];
      }

      const group = new Group();
      parser.associations.set(group, {
        meshes: meshIndex,
      });

      for (let i = 0, il = meshes.length; i < il; i++) {
        group.add(meshes[i]);
      }

      return group;
    });
  }
  createNodeMesh(nodeIndex) {
    const json = this.json;
    const parser = this;
    const nodeDef = json.nodes[nodeIndex];
    if (nodeDef.mesh === undefined) return null;
    return parser.getDependency("mesh", nodeDef.mesh).then(function (mesh) {
      const node = parser._getNodeRef(parser.meshCache, nodeDef.mesh, mesh); // if weights are provided on the node, override weights on the mesh.

      if (nodeDef.weights !== undefined) {
        node.traverse(function (o) {
          if (!o.isMesh) return;

          for (let i = 0, il = nodeDef.weights.length; i < il; i++) {
            o.morphTargetInfluences[i] = nodeDef.weights[i];
          }
        });
      }

      return node;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */

  loadNode(nodeIndex) {
    const json = this.json;
    const extensions = this.extensions;
    const parser = this;
    const nodeDef = json.nodes[nodeIndex]; // reserve node's name before its dependencies, so the root has the intended name.

    const nodeName = nodeDef.name ? parser.createUniqueName(nodeDef.name) : "";
    return (function () {
      const pending = [];

      const meshPromise = parser._invokeOne(function (ext) {
        return ext.createNodeMesh && ext.createNodeMesh(nodeIndex);
      });

      if (meshPromise) {
        pending.push(meshPromise);
      }

      parser
        ._invokeAll(function (ext) {
          return (
            ext.createNodeAttachment && ext.createNodeAttachment(nodeIndex)
          );
        })
        .forEach(function (promise) {
          pending.push(promise);
        });

      return Promise.all(pending);
    })().then(function (objects) {
      let node; // .isBone isn't in glTF spec. See ._markDefs

      if (nodeDef.isBone === true) {
        node = new Bone();
      } else if (objects.length > 1) {
        node = new Group();
      } else if (objects.length === 1) {
        node = objects[0];
      } else {
        node = new Object3D();
      }

      if (node !== objects[0]) {
        for (let i = 0, il = objects.length; i < il; i++) {
          node.add(objects[i]);
        }
      }

      if (nodeDef.name) {
        node.userData.name = nodeDef.name;
        node.name = nodeName;
      }

      if (nodeDef.matrix !== undefined) {
        const matrix = new Matrix4();
        matrix.fromArray(nodeDef.matrix);
        node.applyMatrix4(matrix);
      } else {
        if (nodeDef.translation !== undefined) {
          node.position.fromArray(nodeDef.translation);
        }

        if (nodeDef.rotation !== undefined) {
          node.quaternion.fromArray(nodeDef.rotation);
        }

        if (nodeDef.scale !== undefined) {
          node.scale.fromArray(nodeDef.scale);
        }
      }

      if (!parser.associations.has(node)) {
        parser.associations.set(node, {});
      }

      parser.associations.get(node).nodes = nodeIndex;
      return node;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */

  loadScene(sceneIndex) {
    const json = this.json;
    const extensions = this.extensions;
    const sceneDef = this.json.scenes[sceneIndex];
    const parser = this; // Loader returns Group, not Scene.
    // See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172

    const scene = new Group();
    if (sceneDef.name) scene.name = parser.createUniqueName(sceneDef.name);
    const nodeIds = sceneDef.nodes || [];
    const pending = [];

    for (let i = 0, il = nodeIds.length; i < il; i++) {
      pending.push(buildNodeHierarchy(nodeIds[i], scene, json, parser));
    }

    return Promise.all(pending).then(function () {
      // Removes dangling associations, associations that reference a node that
      // didn't make it into the scene.
      const reduceAssociations = (node) => {
        const reducedAssociations = new Map();

        node.traverse((node) => {
          const mappings = parser.associations.get(node);

          if (mappings != null) {
            reducedAssociations.set(node, mappings);
          }
        });
        return reducedAssociations;
      };

      parser.associations = reduceAssociations(scene);
      return scene;
    });
  }
}

function buildNodeHierarchy(nodeId, parentObject, json, parser) {
  const nodeDef = json.nodes[nodeId];
  return parser
    .getDependency("node", nodeId)
    .then(function (node) {
      if (nodeDef.skin === undefined) return node; // build skeleton here as well

      let skinEntry;
      return parser
        .getDependency("skin", nodeDef.skin)
        .then(function (skin) {
          skinEntry = skin;
          const pendingJoints = [];

          for (let i = 0, il = skinEntry.joints.length; i < il; i++) {
            pendingJoints.push(
              parser.getDependency("node", skinEntry.joints[i])
            );
          }

          return Promise.all(pendingJoints);
        })
        .then(function (jointNodes) {
          node.traverse(function (mesh) {
            if (!mesh.isMesh) return;
            const bones = [];
            const boneInverses = [];

            for (let j = 0, jl = jointNodes.length; j < jl; j++) {
              const jointNode = jointNodes[j];

              if (jointNode) {
                bones.push(jointNode);
                const mat = new Matrix4();

                if (skinEntry.inverseBindMatrices !== undefined) {
                  mat.fromArray(skinEntry.inverseBindMatrices.array, j * 16);
                }

                boneInverses.push(mat);
              } else {
                console.warn(
                  'THREE.GLTFLoader: Joint "%s" could not be found.',
                  skinEntry.joints[j]
                );
              }
            }

            mesh.bind(new Skeleton(bones, boneInverses), mesh.matrixWorld);
          });
          return node;
        });
    })
    .then(function (node) {
      // build node hierachy
      parentObject.add(node);
      const pending = [];

      if (nodeDef.children) {
        const children = nodeDef.children;

        for (let i = 0, il = children.length; i < il; i++) {
          const child = children[i];
          pending.push(buildNodeHierarchy(child, node, json, parser));
        }
      }

      return Promise.all(pending);
    });
}
/**
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */

function addPrimitiveAttributes(geometry, primitiveDef, parser) {
  const attributes = primitiveDef.attributes;
  const pending = [];

  function assignAttributeAccessor(accessorIndex, attributeName) {
    return parser
      .getDependency("accessor", accessorIndex)
      .then(function (accessor) {
        geometry.setAttribute(attributeName, accessor);
      });
  }

  for (const gltfAttributeName in attributes) {
    const threeAttributeName =
      ATTRIBUTES[gltfAttributeName] || gltfAttributeName.toLowerCase(); // Skip attributes already provided by e.g. Draco extension.

    if (threeAttributeName in geometry.attributes) continue;
    pending.push(
      assignAttributeAccessor(attributes[gltfAttributeName], threeAttributeName)
    );
  }

  if (primitiveDef.indices !== undefined && !geometry.index) {
    const accessor = parser
      .getDependency("accessor", primitiveDef.indices)
      .then(function (accessor) {
        geometry.setIndex(accessor);
      });
    pending.push(accessor);
  }

  return Promise.all(pending).then(function () {
    return geometry;
  });
}
/**
 * @param {BufferGeometry} geometry
 * @param {Number} drawMode
 * @return {BufferGeometry}
 */

function toTrianglesDrawMode(geometry, drawMode) {
  let index = geometry.getIndex(); // generate index if not present

  if (index === null) {
    const indices = [];
    const position = geometry.getAttribute("position");

    if (position !== undefined) {
      for (let i = 0; i < position.count; i++) {
        indices.push(i);
      }

      geometry.setIndex(indices);
      index = geometry.getIndex();
    } else {
      console.error(
        "THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."
      );
      return geometry;
    }
  } //

  const numberOfTriangles = index.count - 2;
  const newIndices = [];

  if (drawMode === TriangleFanDrawMode) {
    // gl.TRIANGLE_FAN
    for (let i = 1; i <= numberOfTriangles; i++) {
      newIndices.push(index.getX(0));
      newIndices.push(index.getX(i));
      newIndices.push(index.getX(i + 1));
    }
  } else {
    // gl.TRIANGLE_STRIP
    for (let i = 0; i < numberOfTriangles; i++) {
      if (i % 2 === 0) {
        newIndices.push(index.getX(i));
        newIndices.push(index.getX(i + 1));
        newIndices.push(index.getX(i + 2));
      } else {
        newIndices.push(index.getX(i + 2));
        newIndices.push(index.getX(i + 1));
        newIndices.push(index.getX(i));
      }
    }
  }

  if (newIndices.length / 3 !== numberOfTriangles) {
    console.error(
      "THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles."
    );
  } // build final geometry

  const newGeometry = geometry.clone();
  newGeometry.setIndex(newIndices);
  return newGeometry;
}

export { GLTFLoader };
