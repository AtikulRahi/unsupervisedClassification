var roi = ee.FeatureCollection("projects/ee-learning-rahi/assets/BGD_adm3");

var upzla = roi.filter(ee.Filter.eq("NAME_3", "Maulvibazar S."))
Map.centerObject(upzla,10)
Map.addLayer(upzla,{},"Maulvibazar S.")

var s2 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
          .filterBounds(upzla)
          .filterDate('2022-01-01', '2022-12-31')
          .filter(ee.Filter.lt("CLOUD_COVER",10))
          .median()
var bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5']; // Blue, Green, Red, NIR
var input = s2.select(bands);

var sample = input.sample({
  region: upzla.geometry(),
  scale: 30,
  numPixels: 5000,
});

var clusterer = ee.Clusterer.wekaKMeans(3).train(sample);
var result = input.cluster(clusterer);

Map.addLayer(result.randomVisualizer().clip(upzla), {}, 'Clusters');

Export.image.toDrive({
  image: result.clip(upzla),
  description: 'Clustering',
  folder: 'GEE_exports',
  region: upzla.geometry(),
  scale: 10
});