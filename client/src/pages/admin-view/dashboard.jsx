import ProductImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { addFeatureImage, getFeatureImages } from '@/store/common-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const {featureImageList} = useSelector((state) => state.commonFeature);

  console.log('this is uploadImageUrl', uploadedImageUrl);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      console.log('this is data',data);
      if(data?.payload?.success){
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl('');
      }
    })

  }

  useEffect(() => {
    dispatch(getFeatureImages());

  },[dispatch]);

  return (
    <div>
         
      <ProductImageUpload
        imageFile={imageFile} 
        setImageFile={setImageFile}               
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      <Button 
        onClick={handleUploadFeatureImage}
        className='w-full mt-5'>
      Upload
       </Button>
       <div className="grid grid-cols-2 gap-4 mt-5">
        {featureImageList && featureImageList.length > 0 ?
         featureImageList.map(featureImgItem => <div>
            <img 
             className="w-full h-[300px] object-cover rounded-t-lg" 
             src={featureImgItem.image} />
          </div>)
        : null}
       </div>
    </div>
  )
}

export default AdminDashboard;